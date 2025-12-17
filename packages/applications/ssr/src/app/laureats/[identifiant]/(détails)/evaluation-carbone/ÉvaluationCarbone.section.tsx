import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { getAction, getFournisseurInfos } from '../../_helpers';

import { ÉvaluationCarboneDétails } from './ÉvaluationCarboneDétails';

export type ÉvaluationCarboneSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ÉvaluationCarboneSection = async ({
  identifiantProjet,
}: ÉvaluationCarboneSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const { fournisseurs, évaluationCarboneSimplifiée } =
      await getFournisseurInfos(identifiantProjet);

    const actionFournisseur = await getAction({
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      rôle,
      domain: 'fournisseur',
    });

    return (
      <ÉvaluationCarboneDétails
        fournisseurs={{ value: mapToPlainObject(fournisseurs), action: actionFournisseur }}
        évaluationCarboneSimplifiée={{ value: évaluationCarboneSimplifiée }}
      />
    );
  });
