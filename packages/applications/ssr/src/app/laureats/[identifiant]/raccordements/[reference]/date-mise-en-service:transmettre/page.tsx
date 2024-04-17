import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { Raccordement } from '@potentiel-domain/reseau';
import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  TransmettreDateMiseEnServicePage,
  TransmettreDateMiseEnServiceProps,
} from '@/components/pages/réseau/raccordement/transmettre/transmettreDateMiseEnService/TransmettreDateMiseEnService.page';
import { displayDate } from '@/utils/displayDate';

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

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

    const dossierRaccordement = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>(
      {
        type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
          référenceDossierRaccordementValue: referenceDossierRaccordement,
        },
      },
    );

    const appelOffre = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: candidature.appelOffre,
      },
    });

    const intervalleDatesMeSDélaiCDC2022 = appelOffre.periodes
      .find((p) => p.id === candidature.période)
      ?.cahiersDesChargesModifiésDisponibles.find(
        (cdc) => cdc.type === 'modifié' && cdc.paruLe === '30/08/2022',
      )?.délaiApplicable?.intervaleDateMiseEnService;

    const props: TransmettreDateMiseEnServiceProps = {
      projet: {
        ...candidature,
        dateDésignation: displayDate(candidature.dateDésignation),
        identifiantProjet,
      },
      dossierRaccordement: {
        référence: referenceDossierRaccordement,
        miseEnService:
          dossierRaccordement.miseEnService?.dateMiseEnService?.formatter() ?? undefined,
      },
      intervalleDatesMeSDélaiCDC2022: intervalleDatesMeSDélaiCDC2022
        ? {
            min: displayDate(intervalleDatesMeSDélaiCDC2022.min),
            max: displayDate(intervalleDatesMeSDélaiCDC2022.max),
          }
        : undefined,
    };

    return <TransmettreDateMiseEnServicePage {...props} />;
  });
}
