import { type Message, type MessageHandler, mediator } from 'mediateur';

import { InvalidOperationError } from '@potentiel-domain/core';

import type * as DossierProjet from '../dossierProjet.valueType.js';

export type DéplacerDocumentsProjetCommand = Message<
  'Document.Command.DéplacerDocumentsProjet',
  {
    dossierProjetSource: DossierProjet.ValueType;
    dossierProjetTarget: DossierProjet.ValueType;
  }
>;

export type DéplacerDocumentsProjetPort = (
  dossierProjetSourceKey: string,
  dossierProjetTargetKey: string,
) => Promise<void>;

export type DéplacerDocumentsProjetDependencies = {
  déplacerDocumentsProjet: DéplacerDocumentsProjetPort;
};

export const registerDéplacerDocumentsProjetCommand = ({
  déplacerDocumentsProjet,
}: DéplacerDocumentsProjetDependencies) => {
  const handler: MessageHandler<DéplacerDocumentsProjetCommand> = ({
    dossierProjetSource,
    dossierProjetTarget,
  }) => {
    if (dossierProjetSource.estÉgaleÀ(dossierProjetTarget)) {
      throw new DossiersProjetsIdentiquesError();
    }

    return déplacerDocumentsProjet(
      dossierProjetSource.formatter(),
      dossierProjetTarget.formatter(),
    );
  };
  mediator.register('Document.Command.DéplacerDocumentsProjet', handler);
};

class DossiersProjetsIdentiquesError extends InvalidOperationError {
  constructor() {
    super(`La source et la destination sont identiques`);
  }
}
