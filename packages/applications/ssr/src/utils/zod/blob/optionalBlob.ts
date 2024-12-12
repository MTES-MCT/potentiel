import * as zod from 'zod';

import { cannotExceedSize } from './cannotExceedSize';
import { FileTypes, acceptOnlyFileTypes } from './acceptOnlyFileTypes';

export const optionalBlob = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  zod
    .instanceof(Blob)
    .refine(
      (blob) =>
        options?.acceptedFileTypes
          ? acceptOnlyFileTypes(options.acceptedFileTypes).refine(blob)
          : true,
      options?.acceptedFileTypes ? acceptOnlyFileTypes(options?.acceptedFileTypes).message : '',
    )
    .refine(cannotExceedSize.refine, cannotExceedSize.message);

export type OptionalBlobArray = typeof optionalBlobArray;
export const optionalBlobArray = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  optionalBlob(options)
    .transform((blob) => [blob])
    .or(optionalBlob(options).array());
