import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Raccordement } from '@potentiel-domain/reseau';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Groupe, Role } from '@potentiel-domain/utilisateur';
import { OperationRejectedError } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  TransmettreDateMiseEnServicePage,
  TransmettreDateMiseEnServicePageProps,
} from '@/components/pages/réseau/raccordement/transmettre/transmettreDateMiseEnService/TransmettreDateMiseEnService.page';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

type PageProps = {
  params: {
    identifiant: IdentifiantParameter['params']['identifiant'];
    reference: string;
  };
};

export const metadata: Metadata = {
  title: 'Transmettre la date de mise en service - Potentiel',
  description: 'Transmettre la date de mise en service',
};

export default async function Page({ params: { identifiant, reference } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const projet = await récupérerProjet(identifiantProjet);

      await vérifierQueLeProjetEstClassé({
        statut: projet.statut,
        message:
          "Vous ne pouvez pas transmettre la date de mise en service d'un raccordement pour un projet éliminé ou abandonné",
      });

      const referenceDossierRaccordement = decodeParameter(reference);

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet,
            référenceDossierRaccordementValue: referenceDossierRaccordement,
          },
        });

      if (Option.isNone(dossierRaccordement)) {
        return notFound();
      }

      if (utilisateur.role.estÉgaleÀ(Role.grd)) {
        const groupeAttendu = Groupe.convertirEnValueType(
          `/GestionnairesRéseau/${dossierRaccordement.identifiantGestionnaireRéseau.formatter()}`,
        );
        if (Option.isNone(utilisateur.groupe) || !utilisateur.groupe.estÉgaleÀ(groupeAttendu)) {
          throw new OperationRejectedError(
            `Le gestionnaire de réseau n'est pas attribué à ce dossier de raccordement`,
          );
        }
      }

      const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: {
          identifiantAppelOffre: projet.appelOffre,
        },
      });

      if (Option.isNone(appelOffre)) {
        return notFound();
      }

      const intervalleDatesMeSDélaiCDC2022 = appelOffre.periodes
        .find((p) => p.id === projet.période)
        ?.cahiersDesChargesModifiésDisponibles.find(
          (cdc) => cdc.type === 'modifié' && cdc.paruLe === '30/08/2022',
        )?.délaiApplicable?.intervaleDateMiseEnService;

      const props: TransmettreDateMiseEnServicePageProps = {
        projet: {
          identifiantProjet,
          ...projet,
        },
        dossierRaccordement: {
          référence: referenceDossierRaccordement,
          miseEnService:
            dossierRaccordement.miseEnService?.dateMiseEnService?.formatter() ?? undefined,
        },

        intervalleDatesMeSDélaiCDC2022: intervalleDatesMeSDélaiCDC2022
          ? {
              min: DateTime.convertirEnValueType(intervalleDatesMeSDélaiCDC2022.min).formatter(),
              max: DateTime.convertirEnValueType(intervalleDatesMeSDélaiCDC2022.max).formatter(),
            }
          : undefined,
        lienRetour: utilisateur.role.aLaPermission('réseau.raccordement.consulter')
          ? Routes.Raccordement.détail(identifiantProjet)
          : Routes.Raccordement.lister,
      };

      return <TransmettreDateMiseEnServicePage {...props} />;
    }),
  );
}
