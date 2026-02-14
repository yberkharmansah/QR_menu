export async function uploadImageToCloudinary(file: File) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env values are missing");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const payload = await response.json();
  return payload.secure_url as string;
}

export function optimizeCloudinaryImage(
  sourceUrl: string | undefined,
  variant: "thumb" | "detail" = "detail"
) {
  if (!sourceUrl) return "";
  if (!sourceUrl.includes("/image/upload/")) return sourceUrl;
  if (!sourceUrl.includes("res.cloudinary.com")) return sourceUrl;

  const transformation =
    variant === "thumb"
      ? "c_fill,g_auto,w_128,h_128,f_auto,q_auto"
      : "c_pad,ar_4:3,b_auto,f_auto,q_auto";

  return sourceUrl.replace("/image/upload/", `/image/upload/${transformation}/`);
}
