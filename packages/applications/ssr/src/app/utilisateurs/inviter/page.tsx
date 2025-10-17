import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { InviterUtilisateurUseCase, Role, Région, Zone } from '@potentiel-domain/utilisateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getZoneLabel } from '../_helpers/getZoneLabel';

import { InviterUtilisateurPage } from './InviterUtilisateur.page';

export const metadata: Metadata = {
  title: 'Inviter - Potentiel',
  description: 'Inviter un utilisateur',
};

export default async function Page({ searchParams }: { searchParams: { role?: string } }) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.role.peutExécuterMessage<InviterUtilisateurUseCase>(
        'Utilisateur.UseCase.InviterUtilisateur',
      );
      const role = searchParams?.role ? Role.convertirEnValueType(searchParams.role) : undefined;
      const gestionnairesRéseau =
        await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
          data: {},
        });

      return (
        <InviterUtilisateurPage
          role={role?.nom}
          régions={Région.régions
            .map((nom) => ({ label: nom, value: nom }))
            .sort((a, b) => a.label.localeCompare(b.label))}
          gestionnairesRéseau={gestionnairesRéseau.items.map(
            ({ raisonSociale, identifiantGestionnaireRéseau: { codeEIC } }) => ({
              label: raisonSociale,
              value: codeEIC,
            }),
          )}
          zones={Zone.zones.map((nom) => ({ label: getZoneLabel(nom), value: nom }))}
        />
      );
    }),
  );
}
