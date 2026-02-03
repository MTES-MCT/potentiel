import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';

import {
  DétailsRaccordementDuProjetPage,
  DétailsRaccordementPageProps,
} from './DétailsRaccordementDuProjet.page';
import {
  getModificationDCRAction,
  getModificationGestionnaireRéseauAction,
  getModificationPTFAction,
  getSupprimerDossierAction,
} from './_helpers';

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

      const lauréat = await récupérerLauréatNonAbandonné(identifiantProjet.formatter());

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
          gestionnaireRéseau={mapToPlainObject(raccordement.gestionnaireRéseau)}
          dossiers={mapToDossierActions({
            rôle: utilisateur.rôle,
            dossiers: raccordement.dossiers,
            statutLauréat: lauréat.statut,
          })}
          actions={mapToRaccordementActions({
            rôle: utilisateur.rôle,
            statutLauréat: lauréat.statut,
            identifiantGestionnaireActuel: raccordement.identifiantGestionnaireRéseau,
            dossiers: raccordement.dossiers,
          })}
          lienRetour={lienRetour}
        />
      );
    }),
  );
}

type MapToDossierActions = (args: {
  rôle: Role.ValueType;
  dossiers: Lauréat.Raccordement.ConsulterRaccordementReadModel['dossiers'];
  statutLauréat: Lauréat.StatutLauréat.ValueType;
}) => DétailsRaccordementPageProps['dossiers'];

const mapToDossierActions: MapToDossierActions = ({ rôle, dossiers, statutLauréat }) =>
  dossiers.map((dossier) =>
    mapToPlainObject({
      ...dossier,
      actions: {
        supprimer: getSupprimerDossierAction({
          rôle,
          statutLauréat,
          dossierEnService: !!dossier.miseEnService?.dateMiseEnService?.date,
        }),

        demandeComplèteRaccordement: {
          transmettre: rôle.aLaPermission('raccordement.demande-complète-raccordement.transmettre'),
          modifier: getModificationDCRAction({
            rôle,
            dossier,
            statutLauréat,
          }),
          modifierRéférence:
            rôle.aLaPermission('raccordement.référence-dossier.modifier') &&
            !rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier'),
        },

        propositionTechniqueEtFinancière: {
          transmettre: rôle.aLaPermission(
            'raccordement.proposition-technique-et-financière.transmettre',
          ),
          modifier: getModificationPTFAction({
            rôle,
            dossier,
            statutLauréat,
          }),
        },

        miseEnService: {
          transmettre: rôle.aLaPermission('raccordement.date-mise-en-service.transmettre'),
          modifier: rôle.aLaPermission('raccordement.date-mise-en-service.modifier'),
        },
      },
    }),
  );

type MapToRaccordementActions = (args: {
  rôle: Role.ValueType;
  statutLauréat: Lauréat.StatutLauréat.ValueType;
  identifiantGestionnaireActuel: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  dossiers: Lauréat.Raccordement.ConsulterRaccordementReadModel['dossiers'];
}) => DétailsRaccordementPageProps['actions'];

const mapToRaccordementActions: MapToRaccordementActions = ({
  rôle,
  statutLauréat,
  identifiantGestionnaireActuel,
  dossiers,
}) => ({
  gestionnaireRéseau: {
    modifier: getModificationGestionnaireRéseauAction({
      rôle,
      statutLauréat,
      identifiantGestionnaireActuel,
      aUnDossierEnService:
        dossiers.filter((dossier) => !!dossier.miseEnService?.dateMiseEnService?.date).length > 0,
    }),
  },
  créerNouveauDossier: rôle.aLaPermission('raccordement.demande-complète-raccordement.transmettre'),
});
