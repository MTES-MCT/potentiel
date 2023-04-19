import { ReadModel } from '@potentiel/core-domain';
import { IdentifiantGestionnaireRéseau } from '../gestionnaireRéseau';

export type ProjetReadModel = ReadModel<
  'projet',
  {
    identifiantGestionnaire?: IdentifiantGestionnaireRéseau;
  }
>;
