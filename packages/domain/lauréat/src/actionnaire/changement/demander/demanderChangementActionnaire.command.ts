import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { loadActionnaireFactory } from '../../actionnaire.aggregate';

export type DemanderChangementCommand = Message<
  'Lauréat.Actionnaire.Command.DemanderChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    actionnaire: string;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderChangementActionnaireCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);

  const handler: MessageHandler<DemanderChangementCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    actionnaire,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const actionnaireAggrégat = await loadActionnaire(identifiantProjet);
    const {
      statut,
      lauréat: { abandon },
    } = await getProjetAggregateRoot(identifiantProjet);

    await actionnaireAggrégat.demanderChangement({
      identifiantProjet,
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
      actionnaire,
      estAbandonné: statut.estAbandonné(),
      demandeAbandonEnCours: abandon.statut.estEnCours(),
      estAchevé: statut.estAchevé(),
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.DemanderChangement', handler);
};
