import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { loadGarantiesFinancièresFactory } from '../../../garantiesFinancières/garantiesFinancières.aggregate';
import { loadActionnaireFactory } from '../../actionnaire.aggregate';

export type EnregistrerChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.EnregistrerChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    actionnaire: string;
    dateChangement: DateTime.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    raison: string;
  }
>;

export const registerEnregistrerChangementActionnaireCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);

  const handler: MessageHandler<EnregistrerChangementActionnaireCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    actionnaire,
    dateChangement,
    pièceJustificative,
    raison,
  }) => {
    const actionnaireAggrégat = await loadActionnaire(identifiantProjet);
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    // quickwin : nous passons ici par un appel à l'agrégat candidature au lieu de projet
    // cela devrait être repris quand les types d'actionnariat seront migrés dans l'aggregat Actionnaire
    // Par ailleurs les données sont les mêmes à date (janv 2025)
    const {
      statut,
      lauréat: { abandon },
      candidature: { typeActionnariat },
    } = await getProjetAggregateRoot(identifiantProjet);

    await actionnaireAggrégat.enregistrerChangement({
      identifiantProjet,
      identifiantUtilisateur,
      actionnaire,
      dateChangement,
      pièceJustificative,
      raison,
      estAbandonné: statut.estAbandonné(),
      estAchevé: statut.estAchevé(),
      demandeAbandonEnCours: abandon.statut.estEnCours(),
      typeActionnariat,
      aDesGarantiesFinancièresConstituées: !!garantiesFinancières?.actuelles,
      aUnDépotEnCours: !!garantiesFinancières?.dépôtsEnCours,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.EnregistrerChangement', handler);
};
