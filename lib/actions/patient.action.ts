/* eslint-disable @typescript-eslint/no-explicit-any */
import { ID, Models, Query } from "node-appwrite";
import {
  databases,
  env_variables,
  storage,
  users,
} from "../../appwrite.config";
import { AppwriteException } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return newUser;
  } catch (error: any) {
    console.log(error?.code);
    if (error.code === 409) {
      const documents = await users.list([Query.equal("email", [user.email])]);
      console.log(documents);

      if (user?.name !== documents?.users[0]?.name) {
        await users.updateName(documents?.users[0]?.$id, user.name);
      }
      if (user?.phone !== documents?.users[0]?.phone) {
        await users.updatePhone(documents?.users[0]?.$id, user.phone);
      }

      return documents.users[0];
    }
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return JSON.parse(JSON.stringify(user));
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof AppwriteException) {
      return error.response;
    }
    throw error;
  }
};

export const register_patient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    const patients = await databases.listDocuments(
      env_variables.DATABASE_ID!,
      env_variables.PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [patient.userId])]
    );
    const find_patient =
      patients.documents.length === 0 ? null : patients.documents[0];
    console.log(find_patient);

    if (find_patient !== null) {
      const update_patient = await databases.updateDocument(
        env_variables.DATABASE_ID!,
        env_variables.PATIENT_COLLECTION_ID!,
        find_patient.$id,
        {
          identificationDocumentId: find_patient.identificationDocumentId,
          identificationDocumentUrl: find_patient.identificationDocumentUrl,
          ...patient,
        }
      );
      console.log(update_patient);
      return parseStringify(update_patient);
    } else {
      let file: Models.File | undefined;

      if (identificationDocument) {
        const inputFile = InputFile.fromBuffer(
          identificationDocument?.get("blob_file") as Blob,
          identificationDocument?.get("file_name") as string
        );

        file = await storage.createFile(
          env_variables.BUCKET_ID!,
          ID.unique(),
          inputFile
        );
      }

      const new_patient = await databases.createDocument(
        env_variables.DATABASE_ID!,
        env_variables.PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          identificationDocumentId: file?.$id ?? null,
          identificationDocumentUrl: file
            ? `${env_variables.ENDPOINT}/storage/buckets/${env_variables.BUCKET_ID}/files/${file.$id}/view?project=${env_variables.PROJECT_ID}`
            : null,
          ...patient,
        }
      );

      console.log(new_patient);
      return parseStringify(new_patient);
    }
  } catch (error) {
    console.log(error);
  }
};
export const get_patient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      env_variables.DATABASE_ID!,
      env_variables.PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    console.log(patients.documents);
    if (patients?.documents?.length === 0) {
      return null;
    } else {
      return parseStringify(patients.documents[0]);
    }
  } catch (error) {
    console.log(error);
  }
};
