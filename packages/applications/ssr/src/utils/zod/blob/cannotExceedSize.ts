export const fileSizeLimitInMegaBytes = 25;
export const fileSizeLimitInBytes = fileSizeLimitInMegaBytes * 1024 * 1024;

const refine = ({ size }: Blob) => size <= fileSizeLimitInBytes;
const message = `Le fichier dépasse la taille maximale autorisée (${fileSizeLimitInMegaBytes}Mo)`;

export const cannotExceedSize = { refine, message };
