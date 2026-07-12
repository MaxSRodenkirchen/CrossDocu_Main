import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const directoryPath = path.join(process.cwd(), 'content/images');
const MAX_WIDTH = 1920;

async function optimizeImages() {
    console.log("Checking for oversized images...");
    try {
        const files = await fs.readdir(directoryPath);
        
        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                continue;
            }

            const filePath = path.join(directoryPath, file);
            
            try {
                const metadata = await sharp(filePath).metadata();
                
                // If image is wider than MAX_WIDTH, scale it down
                if (metadata.width > MAX_WIDTH) {
                    console.log(`Optimizing: ${file} (Original width: ${metadata.width}px)`);
                    
                    const tempPath = filePath + '.tmp';
                    
                    // Resize to MAX_WIDTH, keeping aspect ratio and preserving original format
                    await sharp(filePath)
                        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                        .toFile(tempPath);
                        
                    // Overwrite the original file
                    await fs.rename(tempPath, filePath);
                }
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
        console.log("Image optimization check complete.");
    } catch (err) {
        console.error("Could not read images directory (might not exist yet):", err);
    }
}

optimizeImages();
