import * as zod from 'zod';

import { cannotExceedSize } from './cannotExceedSize';
import { FileTypes, acceptOnlyFileTypes } from './acceptOnlyFileTypes';

export const requiredBlob = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  zod
    .instanceof(Blob)
    .refine(({ size }) => size > 0, `Champ obligatoire`)
    .refine(
      (blob) =>
        options?.acceptedFileTypes
          ? acceptOnlyFileTypes(options.acceptedFileTypes).refine(blob)
          : true,
      options?.acceptedFileTypes ? acceptOnlyFileTypes(options?.acceptedFileTypes).message : '',
    )
    .refine(cannotExceedSize.refine, cannotExceedSize.message);

export type RequiredBlobArray = typeof requiredBlobArray;
export const requiredBlobArray = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  requiredBlob(options)
    .transform((blob) => [blob])
    .or(requiredBlob(options).array().min(1, 'Champ obligatoire'));
