const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

export function getImageUrl(post) {
  if (!post) return null;

  const imagePath = post.image || post.image_url;
  if (!imagePath) return null;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${STORAGE_URL}/${cleanPath}`;
}
