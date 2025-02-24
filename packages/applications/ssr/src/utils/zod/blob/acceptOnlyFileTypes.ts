export type FileTypes = 'application/pdf' | 'text/csv';

const refine =
  (fileTypes: Array<FileTypes>) =>
  ({ type, size, name }: File) => {
    // ignore missing files, this is handled by the schema
    if (size === 0) {
      return true;
    }
    // Specific case for Firefox on windows
    // see https://support.mozilla.org/en-US/questions/1401889
    if (type === 'application/vnd.ms-excel') {
      return fileTypes.includes('text/csv') && name.endsWith('.csv');
    }
    return size === 0 || fileTypes.includes(type as FileTypes);
  };

const message = (fileTypes: Array<FileTypes>) =>
  `Seuls les fichiers ${fileTypes.map((fileType) => fileType.replace('application/', '')).join(',')} sont autorisés`;

export const acceptOnlyFileTypes = (fileTypes: Array<FileTypes>) => ({
  refine: refine(fileTypes),
  message: message(fileTypes),
});
