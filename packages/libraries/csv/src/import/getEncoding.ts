import { detect } from 'chardet';

import { ParseOptions } from './parseCsv';

export const getEncoding = (
  arrayBuffer: Uint8Array,
  expectedEncoding: ParseOptions['encoding'],
) => {
  if (expectedEncoding) {
    return expectedEncoding;
  }

  const encoding = detect(arrayBuffer);
  if (!encoding) {
    throw new Error('Encoding cannot be determined');
  }
  return encoding;
};
