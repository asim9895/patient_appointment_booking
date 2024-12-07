import * as sdk from "node-appwrite";
export const env_variables = {
  PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
  API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  DATABASE_ID: process.env.NEXT_PUBLIC_DATABASE_ID,
  PATIENT_COLLECTION_ID: process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID: process.env.NEXT_PUBLIC_DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID: process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID,
  BUCKET_ID: process.env.NEXT_PUBLIC_BUCKET_ID,
  ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
};

if (
  !env_variables.ENDPOINT ||
  !env_variables.PROJECT_ID ||
  !env_variables.API_KEY
) {
  throw new Error("Missing required environment variables");
}

const client = new sdk.Client();

client
  .setEndpoint(env_variables.ENDPOINT)
  .setProject(env_variables.PROJECT_ID)
  .setKey(env_variables.API_KEY);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
