import { mediator } from 'mediateur';

import type {
  TrouverUtilisateurQuery,
  TrouverUtilisateurReadModel,
} from '@potentiel-domain/utilisateur';
import type { Option } from '@potentiel-libraries/monads';

export type GetUtilisateurFromEmail = (
  email: string,
) => Promise<Option.Type<TrouverUtilisateurReadModel>>;

export const getUtilisateurFromEmail: GetUtilisateurFromEmail = async (email) => {
  return await mediator.send<TrouverUtilisateurQuery>({
    type: 'System.Utilisateur.Query.TrouverUtilisateur',
    data: {
      identifiantUtilisateur: email,
    },
  });
};
