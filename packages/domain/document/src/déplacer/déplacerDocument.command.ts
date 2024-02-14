import { Message, MessageHandler, mediator } from 'mediateur';
import * as DossierProjet from '../dossierProjet.valueType';

export type DéplacerDossierProjetCommand = Message<
  'DÉPLACER_DOCUMENT_PROJET_COMMAND',
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
  mediator.register('DÉPLACER_DOCUMENT_PROJET_COMMAND', handler);
};
