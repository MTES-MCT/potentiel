import { Where, WhereOptions } from '@potentiel-domain/entity';
import {
  Role,
  RécupérerIdentifiantsProjetParEmailPorteurPort,
} from '@potentiel-domain/utilisateur';

export type Utilisateur = {
  rôle: string;
  régionDreal?: string;
  identifiantUtilisateur: string;
};

export const getRoleBasedWhereCondition = async (
  utilisateur: Utilisateur,
  récupérerIdentifiantsProjetParEmailPorteur: RécupérerIdentifiantsProjetParEmailPorteurPort,
): Promise<WhereOptions<{ identifiantProjet: string; régionProjet: string }>> => {
  const rôleValueType = Role.convertirEnValueType(utilisateur.rôle);

  if (rôleValueType.estÉgaleÀ(Role.porteur)) {
    const identifiantProjets = await récupérerIdentifiantsProjetParEmailPorteur(
      utilisateur.identifiantUtilisateur,
    );

    return { identifiantProjet: Where.matchAny(identifiantProjets) };
  }
  if (rôleValueType.estÉgaleÀ(Role.dreal)) {
    return { régionProjet: Where.equal(utilisateur.régionDreal ?? 'non-trouvée') };
  }

  return {};
};
