import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { fileExists, upload } from '@potentiel-libraries/file-storage';
import { DocumentProjet } from '@potentiel-domain/document';

import { updateOneProjection, upsertProjection } from '../../../infrastructure';

import { getSensitiveDocReplacement } from './getSensitiveDocReplacement';

export const handleChangementReprésentantLégalAccordé = async (
  event: ReprésentantLégal.ChangementReprésentantLégalAccordéEvent,
) => {
  const {
    payload: {
      identifiantProjet,
      nomReprésentantLégal,
      typeReprésentantLégal,
      accordéLe,
      accordéPar,
    },
  } = event;

  const changementReprésentantLégal =
    await findProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${identifiantProjet}`,
    );

  if (Option.isNone(changementReprésentantLégal)) {
    getLogger().warn(`Aucune demande n'a été trouvée pour le changement de représentant accordé`, {
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
        statut: ReprésentantLégal.StatutChangementReprésentantLégal.accordé.formatter(),
        accord: {
          nomReprésentantLégal,
          typeReprésentantLégal,
          accordéLe,
          accordéPar,
        },
      },
    },
  );

  updateOneProjection<ReprésentantLégal.ReprésentantLégalEntity>(
    `représentant-légal|${identifiantProjet}`,
    {
      nomReprésentantLégal,
      typeReprésentantLégal,
    },
  );

  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
    changementReprésentantLégal.demande.demandéLe,
    changementReprésentantLégal.demande.pièceJustificative.format,
  );

  if (await fileExists(pièceJustificative.formatter())) {
    await upload(
      pièceJustificative.formatter(),
      await getSensitiveDocReplacement('Document sensible supprimé automatiquement après accord'),
    );
  }
};
