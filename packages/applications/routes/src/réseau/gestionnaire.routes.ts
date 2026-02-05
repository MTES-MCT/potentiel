import { encodeParameter } from '../encodeParameter.js';

export const lister = '/reseaux/gestionnaires';

export const détail = (identifiantGestionnaireRéseau: string) =>
  `/reseaux/gestionnaires/${encodeParameter(identifiantGestionnaireRéseau)}`;

export const ajouter = '/reseaux/gestionnaires/ajouter';

export const téléchargerRaccordementEnAttenteMiseEnService = (
  identifiantGestionnaireReseau: string,
) =>
  `/reseaux/gestionnaires/${encodeParameter(identifiantGestionnaireReseau)}/raccordements/mise-en-service-en-attente:exporter`;
