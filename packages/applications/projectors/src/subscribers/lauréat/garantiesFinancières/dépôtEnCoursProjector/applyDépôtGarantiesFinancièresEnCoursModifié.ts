import { IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

import { getProjectData } from '../../../helpers/getProjectData';
import { upsertProjection } from '../../../../infrastructure/upsertProjection';
import { removeProjection } from '../../../../infrastructure/removeProjection';

export const applyDépôtGarantiesFinancièresEnCoursModifié = async (
  identifiantProjet: IdentifiantProjet.RawType,
  { payload }: GarantiesFinancières.DépôtGarantiesFinancièresEnCoursModifiéEvent,
) => {
  const détailProjet = await getProjectData(identifiantProjet);

  const dépôtEnCoursGarantiesFinancières =
    await findProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
      `depot-en-cours-garanties-financieres|${identifiantProjet}`,
    );

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
        dateConstitution: payload.dateConstitution,
        attestation: payload.attestation,
        dateÉchéance: payload.dateÉchéance,
        dernièreMiseÀJour: {
          date: payload.modifiéLe,
          par: payload.modifiéPar,
        },
        soumisLe: Option.isSome(dépôtEnCoursGarantiesFinancières)
          ? dépôtEnCoursGarantiesFinancières.dépôt.soumisLe
          : '',
      },
    },
  );

  await removeProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
  );
};
