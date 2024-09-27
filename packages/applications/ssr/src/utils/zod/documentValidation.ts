import * as zod from 'zod';

export const DEFAULT_FILE_SIZE_LIMIT_IN_MB = 0;

export const DEFAULT_FILE_SIZE_LIMIT_FOR_ZOD = DEFAULT_FILE_SIZE_LIMIT_IN_MB * 1024 * 1024;

export const validateDocumentSize = (
  file: Blob,
  ctx: zod.RefinementCtx,
  fileKey: string,
  fileName?: string,
) => {
  const nameToDisplay = fileName ?? 'Le fichier';
  if (file.size <= 0) {
    ctx.addIssue({
      code: zod.ZodIssueCode.too_small,
      minimum: 0,
      type: 'number',
      inclusive: true,
      message: `${nameToDisplay} est vide`,
      path: [fileKey],
    });
  }
  if (file.size > DEFAULT_FILE_SIZE_LIMIT_FOR_ZOD) {
    ctx.addIssue({
      code: zod.ZodIssueCode.too_big,
      maximum: DEFAULT_FILE_SIZE_LIMIT_FOR_ZOD,
      type: 'number',
      inclusive: true,
      message: `${nameToDisplay} dépasse la taille autorisée (5Mo)`,
      path: [fileKey],
    });
  }
};
