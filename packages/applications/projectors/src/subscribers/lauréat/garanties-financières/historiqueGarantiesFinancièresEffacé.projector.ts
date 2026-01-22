import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getArchivesGf, getGfActuelles } from './_utils/index.js';

export const historiqueGarantiesFinancièresEffacéProjector = async ({
  payload: { identifiantProjet, effacéLe, effacéPar },
}: Lauréat.GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent) => {
  const archives = await getArchivesGf(identifiantProjet);
  const actuelles = await getGfActuelles(identifiantProjet);

  if (actuelles) {
    await upsertProjection<Lauréat.GarantiesFinancières.ArchivesGarantiesFinancièresEntity>(
      `archives-garanties-financieres|${identifiantProjet}`,
      {
        identifiantProjet,
        archives: [
          ...(archives?.archives ?? []),
          {
            ...actuelles.garantiesFinancières,
            dernièreMiseÀJour: {
              date: effacéLe,
              par: effacéPar,
            },
            motif: 'changement de producteur',
          },
        ],
      },
    );
  }

  await removeProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
  );

  await removeProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${identifiantProjet}`,
  );
};
