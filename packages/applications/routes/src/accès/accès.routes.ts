import { encodeParameter } from '../encodeParameter';

export const lister = (identifiantProjet: string) => `/acces/${encodeParameter(identifiantProjet)}`;
