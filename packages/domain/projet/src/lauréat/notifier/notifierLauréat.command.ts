import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';
import { IdentifiantProjet } from '../..';

export type NotifierLauréatCommand = Message<
  'Lauréat.Command.NotifierLauréat',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    notifiéLe: DateTime.ValueType;
    notifiéPar: Email.ValueType;
    attestation: { format: string };
    validateur: AppelOffre.Validateur;
  }
>;

export const registerNotifierLauréatCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<NotifierLauréatCommand> = async ({
    attestation,
    identifiantProjet,
    notifiéLe,
    notifiéPar,
    validateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.candidature.notifier({
      notifiéeLe: notifiéLe,
      notifiéePar: notifiéPar,
      attestation,
      validateur,
    });

    await projet.lauréat.notifier({
      attestation: { format: attestation.format },
      importerGarantiesFinancières: true,
    });
  };

  mediator.register('Lauréat.Command.NotifierLauréat', handler);
};
