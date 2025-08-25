import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { getArchivesGf, getGfActuelles } from './_utils';

export const historiqueGarantiesFinancièresEffacéProjector = async ({
  payload: { identifiantProjet, effacéLe, effacéPar },
}: Lauréat.GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent) => {
  const archives = await getArchivesGf(identifiantProjet);
  const actuelles = await getGfActuelles(identifiantProjet);

  if (archives && actuelles) {
    await upsertProjection<GarantiesFinancières.ArchivesGarantiesFinancièresEntity>(
      `archives-garanties-financieres|${identifiantProjet}`,
      {
        ...archives,
        identifiantProjet,
        archives: [
          ...archives.archives,
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

  await removeProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
  );

  await removeProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${identifiantProjet}`,
  );
};
