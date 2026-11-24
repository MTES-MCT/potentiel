import type { Role } from '@potentiel-domain/utilisateur';

export type MailjetListResponse<TData> = {
  Count: number;
  Total: number;
  Data: Array<TData>;
};

export type MailjetContact = {
  ID: number;
  Email: string;
};

export type RôleSansVisiteur = Exclude<Role.RawType, 'visiteur'>;
