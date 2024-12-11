import * as zod from 'zod';

import { cannotExceedSize } from './cannotExceedSize';
import { FileTypes, onlyFileType } from './onlyFileType';

export const optionalBlob = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  zod
    .instanceof(Blob)
    .refine(
      (blob) =>
        options?.acceptedFileTypes ? onlyFileType(options.acceptedFileTypes).refine(blob) : true,
      options?.acceptedFileTypes ? onlyFileType(options?.acceptedFileTypes).message : '',
    )
    .refine(cannotExceedSize.refine, cannotExceedSize.message);

export type OptionalBlobArray = typeof optionalBlobArray;
export const optionalBlobArray = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  optionalBlob(options)
    .transform((blob) => [blob])
    .or(optionalBlob(options).array());
