import { mediator } from 'mediateur';

import { Période } from '@potentiel-domain/periode';
import { Role, Zone } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/projet';

import { getBaseUrl, listerCocontractantRecipients } from '#helpers';
import { sendEmail } from '#sendEmail';
import { listerRecipients } from '#helpers';

export const handlePériodeNotifiée = async ({
  payload: { identifiantPériode, notifiéeLe },
}: Période.PériodeNotifiéeEvent) => {
  const identifiantPériodeValueType =
    Période.IdentifiantPériode.convertirEnValueType(identifiantPériode);

  const utilisateursAutresQuePorteurs = await listerRecipients({
    roles: [
      Role.admin.nom,
      Role.dreal.nom,
      Role.ademe.nom,
      Role.caisseDesDépôts.nom,
      Role.cre.nom,
      Role.dgecValidateur.nom,
    ],
  });

  const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
    type: 'Candidature.Query.ListerCandidatures',
    data: {
      appelOffre: [identifiantPériodeValueType.appelOffre],
      période: identifiantPériodeValueType.période,
    },
  });

  const zones = [
    ...new Set(
      candidatures.items.map((candidature) => Zone.déterminer(candidature.localité.région).nom),
    ),
  ];

  const cocontractantRecipients = await listerCocontractantRecipients(zones);

  for (const email of [...utilisateursAutresQuePorteurs, ...cocontractantRecipients]) {
    await sendEmail({
      key: 'période/notifier',
      recipients: [email],
      values: {
        appel_offre: identifiantPériodeValueType.appelOffre,
        période: identifiantPériodeValueType.période,
        date_notification: new Date(notifiéeLe).toLocaleDateString('fr-FR'),
        url: getBaseUrl(),
      },
    });
  }
};
