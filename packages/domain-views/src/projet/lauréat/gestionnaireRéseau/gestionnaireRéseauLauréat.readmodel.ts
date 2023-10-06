import { ReadModel } from '@potentiel/core-domain-views';

/**
 * @deprecated le nom initial du stream n'est pas le bon
 */
export type GestionnaireRéseauLauréatLegacyReadModel = ReadModel<
  'projet',
  {
    identifiantGestionnaire: { codeEIC: string };
  }
>;

export type GestionnaireRéseauLauréatReadModel = ReadModel<
  'gestion-réseau-lauréat',
  {
    identifiantGestionnaire: { codeEIC: string };
  }
>;
