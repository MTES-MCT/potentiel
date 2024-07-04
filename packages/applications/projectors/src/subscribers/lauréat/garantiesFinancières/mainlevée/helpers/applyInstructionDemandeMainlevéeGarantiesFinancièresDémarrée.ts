import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../../../infrastructure/upsertProjection';

import { getMainlevéeDemandée } from './getMainlevéeDemandée';

export const applyInstructionDemandeMainlevéeGarantiesFinancièresDémarrée = async ({
  payload: { identifiantProjet, démarréLe, démarréPar },
}: GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent) => {
  const toUpsert = await getMainlevéeDemandée(identifiantProjet);

  if (toUpsert) {
    const data = {
      ...toUpsert,
      dernièreMiseÀJourLe: démarréLe,
      dernièreMiseÀJourPar: démarréPar,

      statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.enInstruction.statut,

      instructionDémarréLe: démarréLe,
      instructionDémarréPar: démarréPar,
    };

    await upsertProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
      `mainlevee-garanties-financieres|${identifiantProjet}#${toUpsert.demandéLe}`,
      data,
    );
  }
};
