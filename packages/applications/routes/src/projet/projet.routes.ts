import { encodeParameter } from '../encodeParameter';

export const details = (identifiantProjet: string) => {
  const url = `/projet/${encodeParameter(identifiantProjet)}/details.html`;
  return url;
};
