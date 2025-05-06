import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { loadProducteurFactory } from '../producteur.aggregate';

export type ModifierProducteurCommand = Message<
  'Lauréat.Producteur.Command.ModifierProducteur',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    producteur: string;
    dateModification: DateTime.ValueType;
  }
>;

export const registerModifierProducteurCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadProducteur = loadProducteurFactory(loadAggregate);

  const handler: MessageHandler<ModifierProducteurCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    producteur,
    dateModification,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    projet.lauréat.vérifierQueLeLauréatExiste();

    const producteurAggrégat = await loadProducteur(identifiantProjet);

    await producteurAggrégat.modifier({
      identifiantProjet,
      identifiantUtilisateur,
      producteur,
      dateModification,
    });
  };
  mediator.register('Lauréat.Producteur.Command.ModifierProducteur', handler);
};
