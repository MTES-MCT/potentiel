import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { updateManyProjections } from '@potentiel-infrastructure/pg-projection-write';

export const instructionDemandeMainlevéeGarantiesFinancièresDémarréeProjector = async ({
  payload: { identifiantProjet, démarréLe, démarréPar },
}: Lauréat.GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent) => {
  await updateManyProjections<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres`,
    {
      identifiantProjet: Where.equal(identifiantProjet),
      statut: Where.equal(
        Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.demandé.statut,
      ),
    },
    {
      statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.enInstruction.statut,
      instruction: { démarréeLe: démarréLe, démarréePar: démarréPar },
      dernièreMiseÀJour: {
        date: démarréLe,
        par: démarréPar,
      },
    },
  );
};
