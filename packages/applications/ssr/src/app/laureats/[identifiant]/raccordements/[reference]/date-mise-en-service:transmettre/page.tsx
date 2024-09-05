import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Raccordement } from '@potentiel-domain/reseau';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  TransmettreDateMiseEnServicePage,
  TransmettreDateMiseEnServicePageProps,
} from '@/components/pages/réseau/raccordement/transmettre/transmettreDateMiseEnService/TransmettreDateMiseEnService.page';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';

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
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const projet = await récupérerProjet(identifiantProjet);

    await vérifierQueLeProjetEstClassé({
      statut: projet.statut,
      message:
        "Vous ne pouvez pas transmettre la date de mise en service d'un raccordement pour un projet non classé",
    });

    const referenceDossierRaccordement = decodeParameter(reference);

    const dossierRaccordement = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>(
      {
        type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
          référenceDossierRaccordementValue: referenceDossierRaccordement,
        },
      },
    );

    if (Option.isNone(dossierRaccordement)) {
      return notFound();
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
    };

    return <TransmettreDateMiseEnServicePage {...props} />;
  });
}
