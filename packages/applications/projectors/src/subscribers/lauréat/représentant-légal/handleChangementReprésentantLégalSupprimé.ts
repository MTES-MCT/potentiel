import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { fileExists, upload } from '@potentiel-libraries/file-storage';
import { DocumentProjet } from '@potentiel-domain/document';

import { removeProjection } from '../../../infrastructure';

import { getSensibleDocReplacement } from './getSensibleDocReplacement';

export const handleChangementReprésentantLégalSupprimé = async (
  event: ReprésentantLégal.ChangementReprésentantLégalSuppriméEvent,
) => {
  const {
    payload: { identifiantProjet },
  } = event;

  const changementReprésentantLégal =
    await findProjection<ReprésentantLégal.ChangementReprésentantLégalEntity>(
      `changement-représentant-légal|${identifiantProjet}`,
    );

  if (Option.isNone(changementReprésentantLégal)) {
    getLogger().warn(`Aucune demande n'a été trouvée pour le changement de représentant supprimé`, {
      event,
    });
    return;
  }

  await removeProjection(`changement-représentant-légal|${identifiantProjet}`);

  const pièceJustificative = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    ReprésentantLégal.TypeDocumentChangementReprésentantLégal.pièceJustificative.formatter(),
    changementReprésentantLégal.demande.demandéLe,
    changementReprésentantLégal.demande.pièceJustificative.format,
  );

  if (await fileExists(pièceJustificative.formatter())) {
    await upload(
      pièceJustificative.formatter(),
      await getSensibleDocReplacement('Document sensible supprimé automatiquement après accord'),
    );
  }
};
