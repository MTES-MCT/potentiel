import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { featureFlag } from '@/app/_helpers/getFeatureFlag';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getLauréatInfos } from '../../_helpers';
import { SignalerPowerPurchaseAgreementPage } from './SignalerPowerPurchaseAgreement.page';

export const metadata: Metadata = { title: 'Signaler un PPA' };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.PowerPurchaseAgreement.SignalerPowerPurchaseAgreementUseCase>(
        'Lauréat.PowerPurchaseAgreement.UseCase.SignalerPowerPurchaseAgreement',
      );

      if (!featureFlag.includes('PPA')) {
        return notFound();
      }

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const lauréat = await getLauréatInfos(identifiantProjet.formatter());

      return (
        <SignalerPowerPurchaseAgreementPage
          identifiantProjet={mapToPlainObject(lauréat.identifiantProjet)}
        />
      );
    }),
  );
}
