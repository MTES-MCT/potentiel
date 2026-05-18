import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getGarantiesFinancières } from '../../_helpers';
import {
  ActionDépôtGarantiesFinancières,
  DétailsDépôtGarantiesFinancièresPage,
} from './DétailsDépôtGarantiesFinancièresPage';

export const metadata: Metadata = { title: 'Détail du dépôt des garanties financières' };

export default async function Page({ params }: IdentifiantParameter) {
  const { identifiant } = await params;
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
      const { dépôt } = await getGarantiesFinancières(identifiantProjet.formatter());

      if (!dépôt) {
        notFound();
      }

      const actions: ActionDépôtGarantiesFinancières[] = [
        'garantiesFinancières.dépôt.modifier',
        'garantiesFinancières.dépôt.valider',
        'garantiesFinancières.dépôt.supprimer',
      ];

      return (
        <DétailsDépôtGarantiesFinancièresPage
          identifiantProjet={identifiantProjet.formatter()}
          dépôt={mapToPlainObject(dépôt)}
          actions={actions.filter((action) => utilisateur.rôle.aLaPermission(action))}
        />
      );
    }),
  );
}
