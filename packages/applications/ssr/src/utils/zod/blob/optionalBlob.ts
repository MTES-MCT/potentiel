import * as zod from 'zod';

import { cannotExceedSize } from './cannotExceedSize';
import { FileTypes, acceptOnlyFileTypes } from './acceptOnlyFileTypes';

export type OptionalBlob = typeof optionalBlob;
export const optionalBlob = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  zod
    .instanceof(Blob)
    .refine(cannotExceedSize.refine, cannotExceedSize.message)
    .refine(
      (blob) =>
        options?.acceptedFileTypes
          ? acceptOnlyFileTypes(options.acceptedFileTypes).refine(blob)
          : true,
      options?.acceptedFileTypes ? acceptOnlyFileTypes(options?.acceptedFileTypes).message : '',
    );

export type OptionalBlobArray = typeof optionalBlobArray;
export const optionalBlobArray = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  optionalBlob(options)
    .transform((blob) => (blob.size === 0 ? undefined : blob))
    .transform((blob) => blob && [blob])
    .or(
      optionalBlob(options)
        .array()
        .transform((blobs) => (blobs.some((blob) => blob.size === 0) ? undefined : blobs)),
    );
