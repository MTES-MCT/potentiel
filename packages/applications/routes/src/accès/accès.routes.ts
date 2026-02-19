import { Candidature } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter.js';

export const lister = (identifiantProjet: string, statut: Candidature.StatutCandidature.RawType) =>
  `/${statut === 'classé' ? 'laureats' : 'elimines'}/${encodeParameter(identifiantProjet)}/utilisateurs`;

export const réclamerProjet = `/reclamer`;
