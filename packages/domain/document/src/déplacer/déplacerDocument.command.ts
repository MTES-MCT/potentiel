import { Message, MessageHandler, mediator } from 'mediateur';

import * as DossierProjet from '../dossierProjet.valueType';

export type DéplacerDossierProjetCommand = Message<
  'Document.Command.DéplacerDocumentProjet',
  {
    dossierProjetSource: DossierProjet.ValueType;
    dossierProjetTarget: DossierProjet.ValueType;
  }
>;

export type DéplacerDossierProjetPort = (
  dossierProjetSourceKey: string,
  dossierProjetTargetKey: string,
) => Promise<void>;

export type DéplacerDossierProjetDependencies = {
  déplacerDossierProjet: DéplacerDossierProjetPort;
};

export const registerDéplacerDocumentCommand = ({
  déplacerDossierProjet,
}: DéplacerDossierProjetDependencies) => {
  const handler: MessageHandler<DéplacerDossierProjetCommand> = ({
    dossierProjetSource,
    dossierProjetTarget,
  }) => déplacerDossierProjet(dossierProjetSource.formatter(), dossierProjetTarget.formatter());
  mediator.register('Document.Command.DéplacerDocumentProjet', handler);
};
