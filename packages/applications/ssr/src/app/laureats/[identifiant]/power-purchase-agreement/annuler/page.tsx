import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { getContext } from '@potentiel-applications/request-context';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getLauréatInfos } from '../../_helpers';

import { AnnulerPowerPurchaseAgreementPage } from './AnnulerPowerPurchaseAgreement.page';

export const metadata: Metadata = {
  title: 'Annuler un PPA - Potentiel',
  description: "Formulaire de signalement d'un PPA pour un projet lauréat",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.PowerPurchaseAgreement.AnnulerPowerPurchaseAgreementUseCase>(
        'Lauréat.PowerPurchaseAgreement.UseCase.AnnulerPowerPurchaseAgreement',
      );

      const { features } = getContext() ?? {};

      if (!features?.includes('PPA')) {
        return notFound();
      }

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const lauréat = await getLauréatInfos(identifiantProjet.formatter());

      const PPA =
        await mediator.send<Lauréat.PowerPurchaseAgreement.ConsulterPowerPurchaseAgreementQuery>({
          type: 'Lauréat.PowerPurchaseAgreement.Query.ConsulterPowerPurchaseAgreement',
          data: {
            identifiantProjetValue: lauréat.identifiantProjet.formatter(),
          },
        });

      if (Option.isNone(PPA)) {
        return notFound();
      }

      return <AnnulerPowerPurchaseAgreementPage PPA={mapToPlainObject(PPA)} />;
    }),
  );
}
