import * as zod from 'zod';

import { cannotExceedSize } from './cannotExceedSize';

export const optionalBlob = () =>
  zod.instanceof(Blob).refine(cannotExceedSize.refine, cannotExceedSize.message);
