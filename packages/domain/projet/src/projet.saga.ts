import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { Option } from '@potentiel-libraries/monads';

import { Candidature, IdentifiantProjet, Lauréat } from '.';

import { NotifierLauréatCommand } from './lauréat/notifier/notifierLauréat.command';
import { NotifierÉliminéCommand } from './éliminé/notifier/notifierÉliminé.command';
import { GarantiesFinancières } from './lauréat';

export type SubscriptionEvent = Candidature.CandidatureNotifiéeEvent & Event;

export type Execute = Message<'System.Projet.Saga.Execute', SubscriptionEvent>;

export type ProjetSagaDependencies = {
  récupererConstitutionGarantiesFinancières: GarantiesFinancières.RécupererConstitutionGarantiesFinancièresPort;
};

export const register = ({ récupererConstitutionGarantiesFinancières }: ProjetSagaDependencies) => {
  const candidatureNotifiéeHandler = async ({ payload }: Candidature.CandidatureNotifiéeEvent) => {
    const statut = Candidature.StatutCandidature.convertirEnValueType(payload.statut);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);
    const data = {
      identifiantProjet,
      notifiéLe: DateTime.convertirEnValueType(payload.notifiéeLe),
      notifiéPar: Email.convertirEnValueType(payload.notifiéePar),
      attestation: payload.attestation,
    };

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(candidature)) {
      throw new Error(`Candidature non trouvée`);
    }

    if (statut.estClassé()) {
      const constitutionGarantiesFinancières =
        await récupererConstitutionGarantiesFinancières(identifiantProjet);

      const garantiesFinancières = candidature.dépôt.garantiesFinancières
        ? Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
            type: candidature.dépôt.garantiesFinancières.type.type,
            dateÉchéance: candidature.dépôt.garantiesFinancières.estAvecDateÉchéance()
              ? candidature.dépôt.garantiesFinancières.dateÉchéance.formatter()
              : undefined,
            attestation: constitutionGarantiesFinancières
              ? { format: constitutionGarantiesFinancières.attestation.format }
              : undefined,
            dateConstitution: constitutionGarantiesFinancières?.dateConstitution,
          })
        : undefined;

      if (constitutionGarantiesFinancières?.attestation) {
        await mediator.send<EnregistrerDocumentProjetCommand>({
          type: 'Document.Command.EnregistrerDocumentProjet',
          data: {
            documentProjet: DocumentProjet.bind({
              dateCréation: constitutionGarantiesFinancières.dateConstitution,
              format: constitutionGarantiesFinancières.attestation.format,
              identifiantProjet: identifiantProjet.formatter(),
              typeDocument:
                Lauréat.GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
            }),
            content: constitutionGarantiesFinancières.attestation.content,
          },
        });
      }
      await mediator.send<NotifierLauréatCommand>({
        type: 'Lauréat.Command.NotifierLauréat',
        data: {
          ...data,
          garantiesFinancières,
        },
      });
    } else {
      await mediator.send<NotifierÉliminéCommand>({
        type: 'Éliminé.Command.NotifierÉliminé',
        data,
      });
    }
  };

  const handler: MessageHandler<Execute> = async (event) => {
    await match(event)
      .with({ type: 'CandidatureNotifiée-V3' }, candidatureNotifiéeHandler)
      .exhaustive();
  };
  mediator.register('System.Projet.Saga.Execute', handler);
};
