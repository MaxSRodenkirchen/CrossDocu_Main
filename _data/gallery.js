import fs from 'fs';
import path from 'path';

export default function() {
    const imagesDir = path.join(process.cwd(), 'content', 'images');
    let images = [];
    try {
        const files = fs.readdirSync(imagesDir);
        images = files.filter(file => {
            // Only include image file extensions
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'].includes(path.extname(file).toLowerCase());
        });
    } catch (e) {
        console.error("Could not read images directory", e);
    }
    
    // Return relative paths to be used in img src tags
    return images.map(img => `/images/${img}`);
};
