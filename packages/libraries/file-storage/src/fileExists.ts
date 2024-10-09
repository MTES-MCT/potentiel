import { assertFileExists } from './assertFileExists';

export const fileExists = async (filePath: string) => {
  try {
    await assertFileExists(filePath);
    return true;
  } catch (e) {
    return false;
  }
};
