import { env_variables, storage } from "@/appwrite.config";

export const getFileFromStorage = async (fileId: string) => {
  try {
    const file = await storage.getFile(env_variables.BUCKET_ID!, fileId);

    const fileUrl = `${env_variables.ENDPOINT}/storage/buckets/${env_variables.BUCKET_ID}/files/${fileId}/view?project=${env_variables.PROJECT_ID}`;

    return {
      file,
      fileUrl,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
