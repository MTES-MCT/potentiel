import { Message, MessageHandler, mediator } from 'mediateur';

import { InvalidOperationError } from '@potentiel-domain/core';

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

export const registerDéplacerDocumentProjetCommand = ({
  déplacerDossierProjet,
}: DéplacerDossierProjetDependencies) => {
  const handler: MessageHandler<DéplacerDossierProjetCommand> = ({
    dossierProjetSource,
    dossierProjetTarget,
  }) => {
    if (dossierProjetSource.estÉgaleÀ(dossierProjetTarget)) {
      throw new DossiersProjetsIdentiquesError();
    }

    return déplacerDossierProjet(dossierProjetSource.formatter(), dossierProjetTarget.formatter());
  };
  mediator.register('Document.Command.DéplacerDocumentProjet', handler);
};

class DossiersProjetsIdentiquesError extends InvalidOperationError {
  constructor() {
    super(`La source et la destination sont identiques`);
  }
}
