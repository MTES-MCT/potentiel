import { encodeParameter } from '../encodeParameter';

export const lister = (identifiantProjet: string) =>
  `/projets/${encodeParameter(identifiantProjet)}/acces`;
