import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { loadAbandonFactory } from '../../../abandon';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';
import { loadProducteurFactory } from '../../producteur.aggregate';

export type EnregistrerChangementProducteurCommand = Message<
  'Lauréat.Producteur.Command.EnregistrerChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    producteur: string;
    dateChangement: DateTime.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    raison?: string;
  }
>;

export const registerEnregistrerChangementProducteurCommand = (loadAggregate: LoadAggregate) => {
  const loadProducteur = loadProducteurFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);

  const handler: MessageHandler<EnregistrerChangementProducteurCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    producteur,
    dateChangement,
    pièceJustificative,
    raison,
  }) => {
    const producteurAggrégat = await loadProducteur(identifiantProjet);
    const abandon = await loadAbandon(identifiantProjet, false);
    const achèvement = await loadAchèvement(identifiantProjet, false);

    // Après migration aggregate root, à remplacer
    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: identifiantProjet.appelOffre,
      },
    });

    await producteurAggrégat.enregistrerChangement({
      identifiantProjet,
      producteur,
      identifiantUtilisateur,
      dateChangement,
      pièceJustificative,
      raison,
      estAbandonné: abandon.statut.estAccordé(),
      estAchevé: achèvement.estAchevé(),
      demandeAbandonEnCours: abandon.statut.estEnCours(),
      appelOffre,
    });
  };
  mediator.register('Lauréat.Producteur.Command.EnregistrerChangement', handler);
};
