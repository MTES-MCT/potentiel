import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Lauréat, Raccordement } from '@potentiel-domain/laureat';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  TransmettreDateMiseEnServicePage,
  TransmettreDateMiseEnServicePageProps,
} from '@/components/pages/réseau/raccordement/transmettre/transmettreDateMiseEnService/TransmettreDateMiseEnService.page';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';

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
      const lauréat = await récupérerLauréatNonAbandonné(identifiantProjet);

      const referenceDossierRaccordement = decodeParameter(reference);

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet,
            référenceDossierRaccordementValue: referenceDossierRaccordement,
          },
        });

      if (Option.isNone(dossierRaccordement)) {
        return notFound();
      }

      const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: {
          identifiantAppelOffre: lauréat.identifiantProjet.appelOffre,
        },
      });

      if (Option.isNone(appelOffre)) {
        return notFound();
      }

      const props = mapToProps({
        utilisateur,
        referenceDossierRaccordement,
        lauréat,
        appelOffre,
        dossierRaccordement,
      });

      return (
        <TransmettreDateMiseEnServicePage
          identifiantProjet={props.identifiantProjet}
          dateDésignation={props.dateDésignation}
          dossierRaccordement={props.dossierRaccordement}
          intervalleDatesMeSDélaiCDC2022={props.intervalleDatesMeSDélaiCDC2022}
        />
      );
    }),
  );
}

type MapToProps = (params: {
  utilisateur: Utilisateur.ValueType;
  referenceDossierRaccordement: string;
  lauréat: Lauréat.ConsulterLauréatReadModel;
  appelOffre: AppelOffre.ConsulterAppelOffreReadModel;
  dossierRaccordement: Raccordement.ConsulterDossierRaccordementReadModel;
}) => TransmettreDateMiseEnServicePageProps;

const mapToProps: MapToProps = ({
  utilisateur,
  referenceDossierRaccordement,
  lauréat,
  appelOffre,
  dossierRaccordement,
}) => {
  const intervalleDatesMeSDélaiCDC2022 = appelOffre.periodes
    .find((p) => p.id === lauréat.identifiantProjet.période)
    ?.cahiersDesChargesModifiésDisponibles.find(
      (cdc) => cdc.type === 'modifié' && cdc.paruLe === '30/08/2022',
    )?.délaiApplicable?.intervaleDateMiseEnService;

  return {
    identifiantProjet: lauréat.identifiantProjet.formatter(),
    dateDésignation: lauréat.notifiéLe.formatter(),

    dossierRaccordement: {
      référence: referenceDossierRaccordement,
      miseEnService: dossierRaccordement.miseEnService?.dateMiseEnService?.formatter() ?? undefined,
    },

    intervalleDatesMeSDélaiCDC2022: intervalleDatesMeSDélaiCDC2022
      ? {
          min: DateTime.convertirEnValueType(intervalleDatesMeSDélaiCDC2022.min).formatter(),
          max: DateTime.convertirEnValueType(intervalleDatesMeSDélaiCDC2022.max).formatter(),
        }
      : undefined,
    lienRetour: utilisateur.role.aLaPermission('raccordement.consulter')
      ? Routes.Raccordement.détail(lauréat.identifiantProjet.formatter())
      : Routes.Raccordement.lister,
  };
};
