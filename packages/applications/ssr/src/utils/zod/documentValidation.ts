import * as zod from 'zod';

export const DEFAULT_FILE_SIZE_LIMIT_IN_MB = 0;

export const DEFAULT_FILE_SIZE_LIMIT_FOR_ZOD = DEFAULT_FILE_SIZE_LIMIT_IN_MB * 1024 * 1024;

export const validateDocumentSize = ({
  filePath,
  fileName,
}: {
  filePath: string;
  fileName?: string;
}) => {
  const nameToDisplay = fileName ?? 'Le fichier';
  return zod
    .instanceof(Blob)
    .refine(({ size }) => size <= 0, {
      path: [filePath],
      message: `${nameToDisplay} est vide`,
    })
    .refine(({ size }) => size > DEFAULT_FILE_SIZE_LIMIT_FOR_ZOD, {
      path: [filePath],
      message: `${nameToDisplay} dépasse la taille autorisée (5Mo)`,
    });
};
