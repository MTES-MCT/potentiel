import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

export type EnregistrerDétailsCandidatureCommandOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  détails: Record<string, string>;
  date: DateTime.ValueType;
};

export type EnregistrerDétailsCandidatureCommand = Message<
  'Candidature.Command.EnregistrerDétailsCandidature',
  EnregistrerDétailsCandidatureCommandOptions
>;

type EnregistrerDocumentProjetPort = (key: string, content: ReadableStream) => Promise<void>;

export type EnregistrerDétailsCandidatureCommandDependencies = {
  enregistrerDocumentProjet: EnregistrerDocumentProjetPort;
};

export const registerEnregistrerDétailsCandidatureCommand = ({
  enregistrerDocumentProjet,
}: EnregistrerDétailsCandidatureCommandDependencies) => {
  const handler: MessageHandler<EnregistrerDétailsCandidatureCommand> = async ({
    date,
    détails,
    identifiantProjet,
  }) => {
    const buf = Buffer.from(JSON.stringify(détails));
    const blob = new Blob([buf]);
    await enregistrerDocumentProjet(
      DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        'candidature/import',
        date.formatter(),
        'application/json',
      ).formatter(),
      blob.stream(),
    );
  };

  mediator.register('Candidature.Command.EnregistrerDétailsCandidature', handler);
};
