import * as zod from 'zod';

import { cannotExceedSize } from './cannotExceedSize';

export const requiredBlob = () =>
  zod
    .instanceof(Blob)
    .refine(({ size }) => size > 0, `Champ obligatoire`)
    .refine(cannotExceedSize.refine, cannotExceedSize.message);

export const requiredBlobArray = requiredBlob().array().min(1, 'Champ obligatoire');
