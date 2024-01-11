import { encodeParameter } from '../encodeParameter';

export const lister = '/reseaux/gestionnaires';

export const détail = (identifiantGestionnaireRéseau: string) =>
  `/reseaux/gestionnaires/${encodeParameter(identifiantGestionnaireRéseau)}`;

export const ajouter = '/reseaux/gestionnaires/ajouter';
