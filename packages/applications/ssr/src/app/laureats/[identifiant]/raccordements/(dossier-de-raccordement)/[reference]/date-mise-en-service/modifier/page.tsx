import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Lauréat } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPériodeAppelOffres, récupérerLauréatNonAbandonné } from '@/app/_helpers';

import {
  ModifierDateMiseEnServicePage,
  ModifierDateMiseEnServicePageProps,
} from './ModifierDateMiseEnService.page';

type PageProps = {
  params: {
    identifiant: IdentifiantParameter['params']['identifiant'];
    reference: string;
  };
};

export const metadata: Metadata = {
  title: 'Modifier la date de mise en service - Potentiel',
  description: 'Modifier la date de mise en service',
};

export default async function Page({ params: { identifiant, reference } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.ModifierDateMiseEnServiceUseCase>(
        'Lauréat.Raccordement.UseCase.ModifierDateMiseEnService',
      );

      const identifiantProjet = decodeParameter(identifiant);
      const lauréat = await récupérerLauréatNonAbandonné(identifiantProjet);

      const referenceDossierRaccordement = decodeParameter(reference);

      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet,
            référenceDossierRaccordementValue: referenceDossierRaccordement,
          },
        });

      if (
        Option.isNone(dossierRaccordement) ||
        !dossierRaccordement.miseEnService?.dateMiseEnService
      ) {
        return notFound();
      }

      const { période } = await getPériodeAppelOffres(
        dossierRaccordement.identifiantProjet.formatter(),
      );

      const props = mapToProps({
        utilisateur,
        lauréat,
        période,
        dossierRaccordement,
      });

      return (
        <ModifierDateMiseEnServicePage
          identifiantProjet={props.identifiantProjet}
          dateDésignation={props.dateDésignation}
          dossierRaccordement={props.dossierRaccordement}
          intervalleDatesMeSDélaiCDC2022={props.intervalleDatesMeSDélaiCDC2022}
          peutSupprimer={props.peutSupprimer}
        />
      );
    }),
  );
}

type MapToProps = (params: {
  utilisateur: Utilisateur.ValueType;
  lauréat: Lauréat.ConsulterLauréatReadModel;
  période: AppelOffre.Periode;
  dossierRaccordement: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
}) => ModifierDateMiseEnServicePageProps;

const mapToProps: MapToProps = ({ utilisateur, lauréat, période, dossierRaccordement }) => {
  const intervalleDatesMeSDélaiCDC2022 = période.cahiersDesChargesModifiésDisponibles.find(
    (cdc) => cdc.type === 'modifié' && cdc.paruLe === '30/08/2022',
  )?.délaiApplicable?.intervaleDateMiseEnService;

  return {
    identifiantProjet: lauréat.identifiantProjet.formatter(),
    dateDésignation: lauréat.notifiéLe.formatter(),

    dossierRaccordement: {
      référence: dossierRaccordement.référence.formatter(),
      dateMiseEnService:
        dossierRaccordement.miseEnService?.dateMiseEnService?.formatter() ?? undefined,
    },

    intervalleDatesMeSDélaiCDC2022: intervalleDatesMeSDélaiCDC2022
      ? {
          min: DateTime.convertirEnValueType(intervalleDatesMeSDélaiCDC2022.min).formatter(),
          max: DateTime.convertirEnValueType(intervalleDatesMeSDélaiCDC2022.max).formatter(),
        }
      : undefined,
    lienRetour: utilisateur.rôle.aLaPermission('raccordement.consulter')
      ? Routes.Raccordement.détail(lauréat.identifiantProjet.formatter())
      : Routes.Raccordement.lister,

    peutSupprimer: utilisateur.rôle.aLaPermission('raccordement.date-mise-en-service.supprimer'),
  };
};
