import * as zod from 'zod';

import { cannotExceedSize } from './cannotExceedSize';
import { FileTypes, onlyFileType } from './onlyFileType';

export const requiredBlob = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  zod
    .instanceof(Blob)
    .refine(({ size }) => size > 0, `Champ obligatoire`)
    .refine(
      (blob) =>
        options?.acceptedFileTypes ? onlyFileType(options.acceptedFileTypes).refine(blob) : true,
      options?.acceptedFileTypes ? onlyFileType(options?.acceptedFileTypes).message : '',
    )
    .refine(cannotExceedSize.refine, cannotExceedSize.message);

export const requiredBlobArray = (options?: { acceptedFileTypes?: Array<FileTypes> }) =>
  requiredBlob({ acceptedFileTypes: options?.acceptedFileTypes })
    .array()
    .min(1, 'Champ obligatoire');
