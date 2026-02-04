// Utility function to convert image paths to full URLs
export const getImageUrl = (imagePaths?: string | string[]): string => {
    if (!imagePaths) return "https://via.placeholder.com/400x400?text=No+Image";

    const imagePath = Array.isArray(imagePaths)
        ? (imagePaths.length > 0 ? imagePaths[0] : null)
        : imagePaths;

    if (!imagePath) return "https://via.placeholder.com/400x400?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;

    // Adjust this base URL to match your backend port
    return `http://localhost:5121${imagePath.startsWith('/') ? '' : '/uploads/'}${imagePath}`;
};

// Convert array of image paths to full URLs
export const getImageUrls = (imagePaths?: string[]): string[] => {
    if (!imagePaths || imagePaths.length === 0) {
        return ["https://via.placeholder.com/400x400?text=No+Image"];
    }

    return imagePaths.map(path => {
        if (path.startsWith("http")) return path;
        return `http://localhost:5121${path.startsWith('/') ? '' : '/uploads/'}${path}`;
    });
};
