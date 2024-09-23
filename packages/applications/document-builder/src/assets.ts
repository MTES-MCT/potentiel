import path from 'node:path';

export const assetsFolderPath = path.resolve(__dirname, 'assets');
export const docxFolderPath = path.resolve(assetsFolderPath, 'docx');
export const fontsFolderPath = path.resolve(assetsFolderPath, 'fonts');
export const imagesFolderPath = path.resolve(assetsFolderPath, 'images');

export const assets = {
  docxFolderPath,
  fontsFolderPath,
  imagesFolderPath,
};
