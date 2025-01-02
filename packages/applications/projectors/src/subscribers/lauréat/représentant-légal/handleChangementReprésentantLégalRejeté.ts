import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { DocumentProjet } from '@potentiel-domain/document';
import { fileExists, upload } from '@potentiel-libraries/file-storage';

import { upsertProjection } from '../../../infrastructure';

import { getSensibleDocReplacement } from './getSensibleDocReplacement';

export const handleChangementReprésentantLégalRejeté = async (
  event: ReprésentantLégal.ChangementReprésentantLégalRejetéEvent,
) => {
  const {
    payload: { identifiantProjet, rejetéLe, rejetéPar },
  } = event;

  const changementReprésentantLégal =
    await findProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${identifiantProjet}`,
    );

  if (Option.isNone(changementReprésentantLégal)) {
    getLogger().warn(`Aucune demande n'a été trouvée pour le changement de représentant rejeté`, {
      event,
    });
    return;
  }

  await upsertProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
    `changement-représentant-légal|${identifiantProjet}`,
    {
      ...changementReprésentantLégal,
      demande: {
        ...changementReprésentantLégal.demande,
        statut: ReprésentantLégal.StatutChangementReprésentantLégal.rejeté.formatter(),
        rejet: {
          rejetéLe,
          rejetéPar,
        },
      },
    },
  );

  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
    changementReprésentantLégal.demande.demandéLe,
    changementReprésentantLégal.demande.pièceJustificative.format,
  );

  if (await fileExists(pièceJustificative.formatter())) {
    await upload(pièceJustificative.formatter(), await getSensibleDocReplacement());
  }
};
