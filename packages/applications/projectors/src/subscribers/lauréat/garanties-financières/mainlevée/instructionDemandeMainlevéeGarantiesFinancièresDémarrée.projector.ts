import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getMainlevéeGf } from '../_utils';

export const instructionDemandeMainlevéeGarantiesFinancièresDémarréeProjector = async ({
  payload: { identifiantProjet, démarréLe, démarréPar },
}: Lauréat.GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent) => {
  const mainlevéeAInstruire = await getMainlevéeGf(identifiantProjet);

  await upsertProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres|${identifiantProjet}#${mainlevéeAInstruire.demande.demandéeLe}`,
    {
      ...mainlevéeAInstruire,
      statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.enInstruction.statut,
      instruction: { démarréeLe: démarréLe, démarréePar: démarréPar },
      dernièreMiseÀJour: {
        date: démarréLe,
        par: démarréPar,
      },
    },
  );
};
