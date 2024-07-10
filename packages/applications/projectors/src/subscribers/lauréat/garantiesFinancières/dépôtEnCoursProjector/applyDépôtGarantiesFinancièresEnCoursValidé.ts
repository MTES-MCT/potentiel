import { IdentifiantProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getProjectData } from '../../../helpers/getProjectData';
import { upsertProjection } from '../../../../infrastructure/upsertProjection';
import { removeProjection } from '../../../../infrastructure/removeProjection';

export const applyDépôtGarantiesFinancièresEnCoursValidé = async (
  identifiantProjet: IdentifiantProjet.RawType,
  { payload }: GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent,
) => {
  const détailProjet = await getProjectData(identifiantProjet);
  const dépôtEnCoursGarantiesFinancières =
    await findProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
      `depot-en-cours-garanties-financieres|${identifiantProjet}`,
    );

  const dépôtEnCoursGarantiesFinancièresDefaultValue: Omit<
    GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity,
    'type'
  > = {
    identifiantProjet,
    nomProjet: '',
    appelOffre: '',
    période: '',
    famille: undefined,
    régionProjet: '',
    dépôt: {
      type: '',
      dateÉchéance: '',
      dateConstitution: '',
      attestation: {
        format: '',
      },
      soumisLe: '',
      dernièreMiseÀJour: {
        date: '',
        par: '',
      },
    },
  };

  const dépôtEnCoursGarantiesFinancièresToUpsert: Omit<
    GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity,
    'type'
  > = Option.isSome(dépôtEnCoursGarantiesFinancières)
    ? dépôtEnCoursGarantiesFinancières
    : dépôtEnCoursGarantiesFinancièresDefaultValue;

  const dépôtValidé = dépôtEnCoursGarantiesFinancièresToUpsert.dépôt;

  if (!dépôtValidé) {
    getLogger().error(
      new Error(
        `dépôt garanties financières en cours absent, impossible d'enregistrer les données des garanties financières validées`,
      ),
      {
        identifiantProjet,
        message: event,
      },
    );
    return;
  }

  await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      appelOffre: détailProjet.appelOffre,
      période: détailProjet.période,
      famille: détailProjet.famille,
      nomProjet: détailProjet.nomProjet,
      régionProjet: détailProjet.régionProjet,
      garantiesFinancières: {
        type: dépôtValidé.type,
        dateÉchéance: dépôtValidé.dateÉchéance ?? undefined,
        attestation: dépôtValidé.attestation,
        dateConstitution: dépôtValidé.dateConstitution,
        validéLe: payload.validéLe,
        soumisLe: dépôtValidé.soumisLe,
        dernièreMiseÀJour: {
          date: payload.validéLe,
          par: payload.validéPar,
        },
      },
    },
  );

  await removeProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${identifiantProjet}`,
  );
};
