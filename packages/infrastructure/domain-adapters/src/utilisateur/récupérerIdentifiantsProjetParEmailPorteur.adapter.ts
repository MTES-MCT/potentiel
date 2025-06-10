import { Email } from '@potentiel-domain/common';
import { RécupérerIdentifiantsProjetParEmailPorteurPort } from '@potentiel-domain/utilisateur';

import { getProjetUtilisateurScopeAdapter } from './getProjetUtilisateurScope.adapter';

/** @deprecated use getProjetUtilisateurScopeAdapter */
export const récupérerIdentifiantsProjetParEmailPorteurAdapter: RécupérerIdentifiantsProjetParEmailPorteurPort =
  async (email: string) => {
    const scope = await getProjetUtilisateurScopeAdapter(Email.convertirEnValueType(email));
    return scope.type === 'projet' ? scope.identifiantProjets : [];
  };
