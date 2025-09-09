import { Where } from '@potentiel-domain/entity';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const getMainlevéeGf = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const mainlevéeEnCoursArray = (
    await listProjection<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
      `mainlevee-garanties-financieres`,
      {
        where: {
          identifiantProjet: Where.equal(identifiantProjet),
          statut: Where.notEqual(
            Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.rejeté.statut,
          ),
        },
      },
    )
  ).items;

  if (mainlevéeEnCoursArray.length !== 1) {
    throw new Error(`Il existe plus d'une main levée en cours pour ce projet`);
  }

  return mainlevéeEnCoursArray[0];
};
