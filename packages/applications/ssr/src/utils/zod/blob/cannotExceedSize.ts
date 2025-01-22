export const fileSizeLimitInMegaBytes = 25;
const fromMegaBytesToBytes = (sizeInMegaBytes: number): number => sizeInMegaBytes * 1024 * 1024;

const refine = ({ size }: Blob) => size <= fromMegaBytesToBytes(fileSizeLimitInMegaBytes);
const message = `Le fichier dépasse la taille maximale autorisée (${fileSizeLimitInMegaBytes}Mo)`;

export const cannotExceedSize = { refine, message };
