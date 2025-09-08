import { Where } from '@potentiel-domain/entity';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const garantiesFinancièresRebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await removeProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${id}`,
  );
  await removeProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${id}`,
  );
  await removeProjection<GarantiesFinancières.ProjetAvecGarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente|${id}`,
  );

  await removeProjection<GarantiesFinancières.ArchivesGarantiesFinancièresEntity>(
    `archives-garanties-financieres|${id}`,
  );

  const mainlevée = await listProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres`,
    { where: { identifiantProjet: Where.equal(id) } },
  );

  for (const détailsMainlevée of mainlevée.items) {
    await removeProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
      `mainlevee-garanties-financieres|${id}#${détailsMainlevée.demande.demandéeLe}`,
    );
  }
};
