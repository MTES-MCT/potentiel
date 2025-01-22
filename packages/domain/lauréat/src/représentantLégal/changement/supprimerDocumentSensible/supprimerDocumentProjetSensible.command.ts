import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';

export type SupprimerDocumentProjetSensibleCommand = Message<
  'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
  }
>;

export type SupprimerDocumentProjetSensiblePort = (
  documentProjet: DocumentProjet.ValueType,
  raison: string,
) => Promise<void>;

export type SupprimerDocumentProjetSensibleCommandDependencies = {
  loadAggregate: LoadAggregate;
  supprimerDocumentProjetSensible: SupprimerDocumentProjetSensiblePort;
};

export const registerSupprimerDocumentProjetSensibleCommand = ({
  loadAggregate,
  supprimerDocumentProjetSensible,
}: SupprimerDocumentProjetSensibleCommandDependencies) => {
  const load = loadReprésentantLégalFactory(loadAggregate);

  const handler: MessageHandler<SupprimerDocumentProjetSensibleCommand> = async ({
    identifiantProjet,
    raison,
  }) => {
    const représentantLégal = await load(identifiantProjet);

    if (représentantLégal.demande) {
      await supprimerDocumentProjetSensible(représentantLégal.demande.pièceJustificative, raison);
    }
  };

  mediator.register('Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible', handler);
};
