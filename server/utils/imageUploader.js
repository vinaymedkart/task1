import cloudinary from "cloudinary";

export const uploadImageToCloudinary = async (file, folder = "task1", height, quality) => {
    const options = { folder };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    options.resource_type = "auto"; // Auto-detect file type (e.g., image, video)
    console.log("Cloudinary options: ", options);

    try {
        return await cloudinary.v2.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        console.error("Error uploading to Cloudinary: ", error);
        throw new Error("Failed to upload image");
    }
};
