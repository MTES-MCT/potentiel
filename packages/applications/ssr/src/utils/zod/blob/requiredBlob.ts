import * as zod from 'zod';

import { cannotExceedSize } from './cannotExceedSize';
import { FileTypes, acceptOnlyFileTypes } from './acceptOnlyFileTypes';

export type RequiredBlob = typeof requiredBlob;
export const requiredBlob = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  zod
    .instanceof(File)
    .refine(cannotExceedSize.refine, cannotExceedSize.message)
    .refine(
      (blob) =>
        options?.acceptedFileTypes
          ? acceptOnlyFileTypes(options.acceptedFileTypes).refine(blob)
          : true,
      options?.acceptedFileTypes ? acceptOnlyFileTypes(options?.acceptedFileTypes).message : '',
    )
    .refine(({ size }) => size > 0, `Champ obligatoire`);

export type RequiredBlobArray = typeof requiredBlobArray;
export const requiredBlobArray = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  requiredBlob(options)
    .transform((blob) => [blob])
    .or(
      requiredBlob(options)
        .array()
        .min(1, 'Champ obligatoire')
        .refine((blobs) => !blobs.some((blob) => blob.size === 0)),
    );
