export type FileTypes = 'application/pdf' | 'application/csv';

const refine =
  (fileTypes: Array<FileTypes>) =>
  ({ type }: Blob) =>
    fileTypes.includes(type as FileTypes);

const message = (fileTypes: Array<FileTypes>) =>
  `Seulement les fichiers ${fileTypes.map((fileType) => fileType.replace('application/', '')).join(',')} sont autorisés`;

export const onlyFileType = (fileTypes: Array<FileTypes>) => ({
  refine: refine(fileTypes),
  message: message(fileTypes),
});
