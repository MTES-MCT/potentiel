import { DomainEvent } from '@potentiel/core-domain';

export type GestionnaireRéseauAjoutéEvent = DomainEvent<
  'GestionnaireRéseauAjouté',
  { raisonSociale: string; codeEIC: string }
>;
