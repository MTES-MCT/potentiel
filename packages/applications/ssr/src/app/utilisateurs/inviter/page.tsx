import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Role } from '@potentiel-domain/utilisateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { GeoApiClient } from '@potentiel-infrastructure/geo-api-client';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { InviterUtilisateurPage } from '@/components/pages/utilisateur/inviter/InviterUtilisateur.page';

export const metadata: Metadata = {
  title: 'Inviter - Potentiel',
  description: 'Inviter un utilisateur',
};

export default async function Page({ searchParams }: { searchParams: { role?: string } }) {
  return PageWithErrorHandling(async () => {
    const role = searchParams?.role ? Role.convertirEnValueType(searchParams.role) : undefined;
    const geoApiClient = GeoApiClient(process.env.NEXT_PUBLIC_GEO_API_URL || '');
    const régions = await geoApiClient.fetchRegions();
    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    return (
      <InviterUtilisateurPage
        role={role?.nom}
        régions={régions
          .map(({ nom }) => ({ label: nom, value: nom }))
          .sort((a, b) => a.label.localeCompare(b.label))}
        gestionnairesRéseau={gestionnairesRéseau.items.map(
          ({ raisonSociale, identifiantGestionnaireRéseau: { codeEIC } }) => ({
            label: raisonSociale,
            value: codeEIC,
          }),
        )}
      />
    );
  });
}
