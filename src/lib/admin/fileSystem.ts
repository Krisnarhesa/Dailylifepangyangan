import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export interface ImageUploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

export async function saveImageToLocal(
  file: Buffer,
  targetPath: string,
  optimize: boolean = true
): Promise<ImageUploadResult> {
  try {
    const fullPath = path.join(process.cwd(), 'public', targetPath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });

    let imageBuffer = file;

    if (optimize) {
      imageBuffer = await sharp(file)
        .resize(1920, 1920, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
    }

    await fs.writeFile(fullPath, imageBuffer);

    return { success: true, path: `/${targetPath}` };
  } catch (error: any) {
    console.error('Image save error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteImageFromLocal(imagePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    await fs.unlink(fullPath);
    return { success: true };
  } catch (error: any) {
    console.error('Image delete error:', error);
    return { success: false, error: error.message };
  }
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const fullPath = path.join(process.cwd(), 'src', 'data', filePath);
  const content = await fs.readFile(fullPath, 'utf-8');
  return JSON.parse(content);
}

export async function writeJsonFile(filePath: string, data: any): Promise<void> {
  const fullPath = path.join(process.cwd(), 'src', 'data', filePath);
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
}
