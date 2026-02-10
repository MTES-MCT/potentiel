import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet } from '../../index.js';

export type EnregistrerDocumentSubstitutCommand = Message<
  'Document.Command.EnregistrerDocumentSubstitut',
  {
    documentProjet: DocumentProjet.ValueType;
    texte: string;
  }
>;

export type EnregistrerDocumentSubstitutPort = (
  documentProjet: DocumentProjet.ValueType,
  texte: string,
) => Promise<void>;

export type EnregistrerDocumentSubstitutCommandDependencies = {
  enregistrerDocumentSubstitut: EnregistrerDocumentSubstitutPort;
};

export const registerEnregistrerDocumentSubstitutCommand = ({
  enregistrerDocumentSubstitut,
}: EnregistrerDocumentSubstitutCommandDependencies) => {
  const handler: MessageHandler<EnregistrerDocumentSubstitutCommand> = async ({
    documentProjet,
    texte,
  }) => {
    await enregistrerDocumentSubstitut(documentProjet, texte);
  };

  mediator.register('Document.Command.EnregistrerDocumentSubstitut', handler);
};
