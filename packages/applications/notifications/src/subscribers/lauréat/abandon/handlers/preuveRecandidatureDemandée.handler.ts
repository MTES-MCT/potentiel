import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { AbandonNotificationsProps } from '../type';
import { listerPorteursRecipients, getBaseUrl } from '../../../../_helpers';
import { abandonNotificationTemplateId } from '../constant';

export const handlePreuveRecandidatureDemandée = async ({
  sendEmail,
  event,
  projet,
}: AbandonNotificationsProps<Lauréat.Abandon.PreuveRecandidatureDemandéeEvent>) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const { appelOffre, période } = identifiantProjet;
  const porteurs = await listerPorteursRecipients(identifiantProjet);

  await sendEmail({
    templateId: abandonNotificationTemplateId.demanderPreuveRecandidature,
    messageSubject: `Potentiel - Transmettre une preuve de recandidature suite à l'abandon du projet ${projet.nom} (${appelOffre} période ${période})`,
    recipients: porteurs,
    variables: {
      nom_projet: projet.nom,
      lien_transmettre_preuve_recandidature: `${getBaseUrl()}${Routes.Abandon.détail(
        identifiantProjet.formatter(),
      )}/`,
    },
  });
};
