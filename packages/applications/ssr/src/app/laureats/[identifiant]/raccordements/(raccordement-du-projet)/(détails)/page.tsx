import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';

import {
  DétailsRaccordementDuProjetPage,
  DétailsRaccordementPageProps,
} from './DétailsRaccordementDuProjet.page';
import { getModificationDCRAction } from './_helpers/getModificationDCRAction';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = {
  title: 'Raccordement du projet - Potentiel',
  description: 'Raccordement du projet',
};

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      await récupérerLauréatNonAbandonné(identifiantProjet.formatter());

      const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(raccordement) || raccordement.dossiers.length === 0) {
        return redirect(
          Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet.formatter()),
        );
      }

      const gestionnaireRéseau =
        await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau:
              raccordement.identifiantGestionnaireRéseau?.formatter() || '',
          },
        });

      const lienRetour = utilisateur.estGrd()
        ? {
            label: 'Retour vers les raccordements',
            href: Routes.Raccordement.lister,
          }
        : {
            label: 'Retour vers le projet',
            href: Routes.Projet.details(identifiantProjet.formatter()),
          };

      return (
        <DétailsRaccordementDuProjetPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          gestionnaireRéseau={mapToPlainObject(gestionnaireRéseau)}
          dossiers={mapToDossierActions(utilisateur, raccordement.dossiers)}
          actions={mapToRaccordementActions(utilisateur)}
          lienRetour={lienRetour}
        />
      );
    }),
  );
}

const mapToDossierActions = (
  { rôle }: Utilisateur.ValueType,
  dossiers: Lauréat.Raccordement.ConsulterRaccordementReadModel['dossiers'],
): DétailsRaccordementPageProps['dossiers'] =>
  dossiers.map((dossier) =>
    mapToPlainObject({
      ...dossier,
      actions: {
        supprimer: rôle.aLaPermission('raccordement.dossier.supprimer'),

        demandeComplèteRaccordement: {
          transmettre: rôle.aLaPermission('raccordement.demande-complète-raccordement.transmettre'),
          modifier: getModificationDCRAction(rôle, dossier),
          modifierRéférence:
            rôle.aLaPermission('raccordement.référence-dossier.modifier') &&
            !rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier'),
        },

        propositionTechniqueEtFinancière: {
          transmettre: rôle.aLaPermission(
            'raccordement.proposition-technique-et-financière.transmettre',
          ),
          modifier: rôle.aLaPermission('raccordement.proposition-technique-et-financière.modifier'),
        },

        miseEnService: {
          transmettre: rôle.aLaPermission('raccordement.date-mise-en-service.transmettre'),
          modifier: rôle.aLaPermission('raccordement.date-mise-en-service.modifier'),
        },
      },
    }),
  );

const mapToRaccordementActions = ({
  rôle,
}: Utilisateur.ValueType): DétailsRaccordementPageProps['actions'] => ({
  gestionnaireRéseau: {
    modifier: rôle.aLaPermission('raccordement.gestionnaire.modifier'),
  },
  créerNouveauDossier: rôle.aLaPermission('raccordement.demande-complète-raccordement.transmettre'),
});
