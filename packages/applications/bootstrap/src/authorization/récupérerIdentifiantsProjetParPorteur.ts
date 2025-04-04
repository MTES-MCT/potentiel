import { Email } from '@potentiel-domain/common';
import {
  RécupérerIdentifiantsProjetParEmailPorteurPort,
  UtilisateurEntity,
} from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const récupererProjetsPorteurAdapter: RécupérerIdentifiantsProjetParEmailPorteurPort =
  async (email: string) => {
    const identifiantUtilisateur = Email.convertirEnValueType(email);
    const utilisateur = await findProjection<UtilisateurEntity>(
      `utilisateur|${identifiantUtilisateur.formatter()}`,
    );
    if (Option.isSome(utilisateur) && utilisateur.rôle === 'porteur-projet') {
      return utilisateur.projets;
    }
    return [];
  };
