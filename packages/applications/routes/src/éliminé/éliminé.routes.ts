import { encodeParameter } from '../encodeParameter';

export const lister = () => `/elimines`;
export const détails = (identifiantProjet: string) =>
  `/elimines/${encodeParameter(identifiantProjet)}`;
