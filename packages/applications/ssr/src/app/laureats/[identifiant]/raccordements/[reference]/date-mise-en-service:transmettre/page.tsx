import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Candidature } from '@potentiel-domain/candidature';
import { Raccordement } from '@potentiel-domain/reseau';
import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  TransmettreDateMiseEnServicePage,
  TransmettreDateMiseEnServicePageProps,
} from '@/components/pages/réseau/raccordement/transmettre/transmettreDateMiseEnService/TransmettreDateMiseEnService.page';

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
    const referenceDossierRaccordement = decodeParameter(reference);

    const candidature = await mediator.send<Candidature.ConsulterProjetQuery>({
      type: 'Candidature.Query.ConsulterProjet',
      data: {
        identifiantProjet,
      },
    });

    if (Option.isNone(candidature)) {
      return notFound();
    }

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

    const appelOffre = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: candidature.appelOffre,
      },
    });

    if (Option.isNone(appelOffre)) {
      return notFound();
    }

    const intervalleDatesMeSDélaiCDC2022 = appelOffre.periodes
      .find((p) => p.id === candidature.période)
      ?.cahiersDesChargesModifiésDisponibles.find(
        (cdc) => cdc.type === 'modifié' && cdc.paruLe === '30/08/2022',
      )?.délaiApplicable?.intervaleDateMiseEnService;

    const props: TransmettreDateMiseEnServicePageProps = {
      projet: {
        identifiantProjet,
        ...candidature,
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
