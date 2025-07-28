import { Entity } from '@potentiel-domain/entity';

export type AchèvementEntity = Entity<
  'achèvement',
  {
    identifiantProjet: string;
    dateAchèvementPrévisionnel: string;
    raison:
      | 'notification'
      | 'covid'
      | 'ajout-délai-cdc-30_08_2022'
      | 'retrait-délai-cdc-30_08_2022'
      | 'délai-accordé'
      | 'inconnue';
  }
>;
