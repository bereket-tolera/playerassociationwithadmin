export function validateImage(file: File): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  const maxSizeMB = 5;

  if (!validTypes.includes(file.type)) {
    return false;
  }

  if (file.size / 1024 / 1024 > maxSizeMB) {
    return false;
  }

  return true;
}

// Make this file a module
export {};
