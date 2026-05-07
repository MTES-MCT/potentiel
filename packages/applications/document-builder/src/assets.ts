import path from 'path';
import { fileURLToPath } from 'url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const assetsFolderPath = path.resolve(currentDir, 'assets');

export const docxFolderPath = path.resolve(assetsFolderPath, 'docx');
export const fontsFolderPath = path.resolve(assetsFolderPath, 'fonts');
export const imagesFolderPath = path.resolve(assetsFolderPath, 'images');

export const assets = {
  docxFolderPath,
  fontsFolderPath,
  imagesFolderPath,
};
