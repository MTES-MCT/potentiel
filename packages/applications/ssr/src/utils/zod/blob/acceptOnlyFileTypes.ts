export type FileTypes = 'application/pdf' | 'text/csv' | 'text/plain';

const refine =
  (fileTypes: Array<FileTypes>) =>
  ({ type, size }: Blob) =>
    size === 0 || fileTypes.includes(type as FileTypes);

const message = (fileTypes: Array<FileTypes>) =>
  `Seuls les fichiers ${fileTypes.map((fileType) => fileType.replace('application/', '')).join(',')} sont autorisés`;

export const acceptOnlyFileTypes = (fileTypes: Array<FileTypes>) => ({
  refine: refine(fileTypes),
  message: message(fileTypes),
});
