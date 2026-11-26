import { Routes } from '@potentiel-applications/routes';
import { Période } from '@potentiel-domain/periode';

import { buildUrl } from '#helpers';
import { sendEmail } from '#sendEmail';

export const handlePériodeImportée = async ({
  payload: { identifiantPériode, importéLe, importéPar },
}: Période.PériodeImportéeEvent) => {
  const { appelOffre, période } =
    Période.IdentifiantPériode.convertirEnValueType(identifiantPériode);
  await sendEmail({
    key: 'période/importer',
    recipients: [importéPar],
    values: {
      appel_offre: appelOffre,
      période: période,
      date_import: new Date(importéLe).toLocaleDateString('fr-FR'),
      url: buildUrl(Routes.Période.lister({ appelOffre, statut: 'a-notifier' })),
    },
  });
};
