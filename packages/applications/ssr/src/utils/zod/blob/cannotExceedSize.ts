const fileSizeLimitInMegaBytes = 5;
const toBytes = (sizeInMegaBytes: number): number => sizeInMegaBytes * 1024 * 1024;

const refine = ({ size }: Blob) => size <= toBytes(fileSizeLimitInMegaBytes);
const message = `Le fichier dépasse la taille maximale autorisée (${fileSizeLimitInMegaBytes}Mo)`;

export const cannotExceedSize = { refine, message };
