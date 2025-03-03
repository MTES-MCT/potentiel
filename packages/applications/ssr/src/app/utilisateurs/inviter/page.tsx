import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Role } from '@potentiel-domain/utilisateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { InviterUtilisateurPage } from '@/components/pages/utilisateur/inviter/InviterUtilisateur.page';

export const metadata: Metadata = {
  title: 'Inviter - Potentiel',
  description: 'Inviter un utilisateur',
};

export default async function Page({ searchParams }: { searchParams: { role?: string } }) {
  return PageWithErrorHandling(async () => {
    const role = searchParams?.role ? Role.convertirEnValueType(searchParams.role) : undefined;
    const régions = (
      await fetch(`${process.env.NEXT_PUBLIC_GEO_API_URL}/regions`).then(
        (r) => r.json() as Promise<{ nom: string }[]>,
      )
    ).map(({ nom }) => ({ label: nom, value: nom }));
    const gestionnairesRéseau = (
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      })
    ).items.map(({ raisonSociale, identifiantGestionnaireRéseau: { codeEIC } }) => ({
      label: raisonSociale,
      value: codeEIC,
    }));

    return (
      <InviterUtilisateurPage
        role={role?.nom}
        régions={régions}
        gestionnairesRéseau={gestionnairesRéseau}
      />
    );
  });
}
