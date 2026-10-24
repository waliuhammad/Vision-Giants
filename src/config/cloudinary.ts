/**
 * Cloudinary delivery helper. Only the public cloud name is used; API keys and secrets
 * belong on a server and must never be added to frontend env variables.
 *
 * Usage: cloudinaryUrl('portfolio/dashboard', 'w_800') ?? '/images/portfolio/dashboard.webp'
 */
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;

export const isCloudinaryConfigured = Boolean(cloudName);

/** Returns an auto-format, auto-quality delivery URL, or null when Cloudinary is not configured. */
export function cloudinaryUrl(publicId: string, transforms = ''): string | null {
  if (!cloudName) return null;
  const t = ['f_auto', 'q_auto', transforms].filter(Boolean).join(',');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${t}/${publicId}`;
}
