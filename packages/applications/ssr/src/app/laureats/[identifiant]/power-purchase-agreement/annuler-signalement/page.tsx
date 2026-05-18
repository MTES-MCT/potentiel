import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { featureFlag } from '@/app/_helpers/getFeatureFlag';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getLauréatInfos } from '../../_helpers';
import { AnnulerSignalementPowerPurchaseAgreementPage } from './AnnulerSignalementPowerPurchaseAgreement.page';

export const metadata: Metadata = {
  title: 'Annuler un signalement PPA - Potentiel',
  description: "Formulaire d'annulation de signalement PPA pour un projet lauréat",
};

export default async function Page({ params }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const { identifiant } = await params;

      utilisateur.rôle.peutExécuterMessage<Lauréat.PowerPurchaseAgreement.AnnulerSignalementPowerPurchaseAgreementUseCase>(
        'Lauréat.PowerPurchaseAgreement.UseCase.AnnulerSignalementPowerPurchaseAgreement',
      );

      if (!featureFlag.includes('PPA')) {
        return notFound();
      }

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const lauréat = await getLauréatInfos(identifiantProjet.formatter());

      const powerPurchaseAgreement =
        await mediator.send<Lauréat.PowerPurchaseAgreement.ConsulterPowerPurchaseAgreementQuery>({
          type: 'Lauréat.PowerPurchaseAgreement.Query.ConsulterPowerPurchaseAgreement',
          data: {
            identifiantProjetValue: lauréat.identifiantProjet.formatter(),
          },
        });

      if (Option.isNone(powerPurchaseAgreement)) {
        return notFound();
      }

      return (
        <AnnulerSignalementPowerPurchaseAgreementPage
          powerPurchaseAgreement={mapToPlainObject(powerPurchaseAgreement)}
        />
      );
    }),
  );
}
