import * as zod from 'zod';

import { normalizeTextArea } from './normalizeTextArea';

export const formatTextArea = () => zod.string().overwrite(normalizeTextArea);
