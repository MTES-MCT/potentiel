import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const handleChangementReprésentantLégalAccordé = async ({
  payload: {
    identifiantProjet,
    nomReprésentantLégal,
    typeReprésentantLégal,
    accordéLe,
    accordéPar,
    réponseSignée,
  },
}: ReprésentantLégal.ChangementReprésentantLégalAccordéEvent) => {
  await updateOneProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${identifiantProjet}`,
    {
      statut: ReprésentantLégal.StatutChangementReprésentantLégal.accordé.formatter(),
      accord: {
        nomReprésentantLégal,
        typeReprésentantLégal,
        accordéLe,
        accordéPar,
        réponseSignée,
      },
    },
  );
};
