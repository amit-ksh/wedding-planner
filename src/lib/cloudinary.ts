import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

interface DeleteResourcesParams {
  deleted: Record<string, string>;
}

export async function deleteResources(publicId: string, resourceType: string) {
  return (await cloudinary.api.delete_resources([publicId], {
    resource_type: resourceType,
  })) as DeleteResourcesParams;
}
