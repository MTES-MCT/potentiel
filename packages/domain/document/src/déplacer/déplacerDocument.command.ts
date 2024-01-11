import { Message, MessageHandler, mediator } from 'mediateur';
import { DocumentProjet } from '..';

export type DéplacerDocumentProjetCommand = Message<
  'DÉPLACER_DOCUMENT_PROJET_COMMAND',
  {
    documentProjetSource: DocumentProjet.ValueType;
    documentProjetTarget: DocumentProjet.ValueType;
  }
>;

export type DéplacerDocumentProjetPort = (
  documentProjetSourceKey: string,
  documentProjetTargetKey: string,
) => Promise<void>;

export type DéplacerDocumentProjetDependencies = {
  déplacerDocumentProjet: DéplacerDocumentProjetPort;
};

export const registerDéplacerDocumentCommand = ({
  déplacerDocumentProjet,
}: DéplacerDocumentProjetDependencies) => {
  const handler: MessageHandler<DéplacerDocumentProjetCommand> = ({
    documentProjetSource,
    documentProjetTarget,
  }) => déplacerDocumentProjet(documentProjetSource.formatter(), documentProjetTarget.formatter());
  mediator.register('DÉPLACER_DOCUMENT_PROJET_COMMAND', handler);
};
