import { Message, MessageHandler, mediator } from 'mediateur';
import { sendEmail } from '@potentiel/email-sender';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { isNone } from '@potentiel/monads';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  récupérerPorteursParIdentifiantProjetAdapter,
  CandidatureAdapter,
  récupérerDrealsParIdentifiantProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-libraries/routes';
import { templateId } from '../templateId';

export type SubscriptionEvent = GarantiesFinancières.GarantiesFinancièresEvent & Event;

export type Execute = Message<
  'System.Notification.Lauréat.GarantiesFinancières',
  SubscriptionEvent
>;

const sendEmailGarantiesFinancièresChangementDeStatut = async ({
  identifiantProjet,
  statut,
  templateId,
  recipients,
  nomProjet,
  départementProjet,
  régionProjet,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: GarantiesFinancières.StatutGarantiesFinancières.ValueType;
  templateId: number;
  recipients: Array<{ email: string; fullName: string }>;
  nomProjet: string;
  départementProjet: string;
  régionProjet: string;
}) => {
  const { BASE_URL } = process.env;

  const nouveauStatut = statut.estEnAttente()
    ? 'en attente'
    : statut.estÀTraiter()
    ? 'en attente de validation'
    : 'validées';

  await sendEmail({
    templateId,
    messageSubject: `Potentiel - Des garanties financières sont ${nouveauStatut} pour le projet ${nomProjet} dans le département ${départementProjet}`,
    recipients,
    variables: {
      nom_projet: nomProjet,
      departement_projet: départementProjet,
      region_projet: régionProjet,
      nouveau_statut: nouveauStatut,
      // TODO : lorsque les différentes pages seront en place, à voir si on redirige directement vers les GF à traiter
      // Il faudra penser à mettre le template à jour en cas de modification
      projet_url: `${BASE_URL}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );
    const projet = await CandidatureAdapter.récupérerCandidatureAdapter(
      identifiantProjet.formatter(),
    );

    const porteurs = await récupérerPorteursParIdentifiantProjetAdapter(identifiantProjet);

    if (isNone(projet) || porteurs.length === 0 || !process.env.DGEC_EMAIL) {
      return;
    }

    const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

    const nomProjet = projet.nom;
    const départementProjet = projet.localité.département;
    const régionProjet = projet.localité.région;

    switch (event.type) {
      case 'DépôtGarantiesFinancièresSoumis-V1':
        await sendEmailGarantiesFinancièresChangementDeStatut({
          statut: GarantiesFinancières.StatutGarantiesFinancières.àTraiter,
          templateId: templateId.garantiesFinancières.àTraiterPourDreal,
          recipients: dreals,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        });

        await sendEmailGarantiesFinancièresChangementDeStatut({
          statut: GarantiesFinancières.StatutGarantiesFinancières.àTraiter,
          templateId: templateId.garantiesFinancières.àTraiterPourPorteur,
          recipients: porteurs,
          identifiantProjet,
          nomProjet,
          départementProjet,
          régionProjet,
        });
        break;
    }
  };

  mediator.register('System.Notification.Lauréat.GarantiesFinancières', handler);
};
