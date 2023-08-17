import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../projet.valueType';

export type GestionnaireRéseauProjetModifiéEvent = DomainEvent<
  'GestionnaireRéseauProjetModifié',
  {
    identifiantProjet: RawIdentifiantProjet;
    identifiantGestionnaireRéseau: string;
  }
>;

export type GestionnaireRéseauProjetDéclaréEvent = DomainEvent<
  'GestionnaireRéseauProjetDéclaré',
  {
    identifiantProjet: RawIdentifiantProjet;
    identifiantGestionnaireRéseau: string;
  }
>;
