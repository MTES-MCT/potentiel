import { IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { getProjectData } from '../../../helpers/getProjectData';
import { upsertProjection } from '../../../../infrastructure/upsertProjection';
import { removeProjection } from '../../../../infrastructure/removeProjection';

export const applyDépôtGarantiesFinancièresSoumis = async (
  identifiantProjet: IdentifiantProjet.RawType,
  { payload }: GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent,
) => {
  const détailProjet = await getProjectData(identifiantProjet);

  await upsertProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      appelOffre: détailProjet.appelOffre,
      période: détailProjet.période,
      famille: détailProjet.famille,
      nomProjet: détailProjet.nomProjet,
      régionProjet: détailProjet.régionProjet,
      dépôt: {
        type: payload.type,
        dateÉchéance: payload.dateÉchéance,
        dateConstitution: payload.dateConstitution,
        attestation: payload.attestation,
        soumisLe: payload.soumisLe,
        dernièreMiseÀJour: {
          date: payload.soumisLe,
          par: payload.soumisPar,
        },
      },
    },
  );

  await removeProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
  );
};
