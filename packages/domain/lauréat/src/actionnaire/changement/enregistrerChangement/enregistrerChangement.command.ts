import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Candidature } from '@potentiel-domain/candidature';

import { loadAbandonFactory } from '../../../abandon';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';
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

export const registerEnregistrerChangementActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<EnregistrerChangementActionnaireCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    actionnaire,
    dateChangement,
    pièceJustificative,
    raison,
  }) => {
    const actionnaireAggrégat = await loadActionnaire(identifiantProjet);
    const abandon = await loadAbandon(identifiantProjet, false);
    const achèvement = await loadAchèvement(identifiantProjet, false);
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    // quickwin : nous passons ici par un appel à l'agrégat candidature au lieu de projet
    // cela devrait être repris quand les types d'actionnariat seront migrés dans l'aggregat Actionnaire
    // Par ailleurs les données sont les mêmes à date (janv 2025)
    const candidature = await loadCandidature(identifiantProjet);

    const estParticipatif =
      candidature.typeActionnariat?.type === 'financement-participatif' ||
      candidature.typeActionnariat?.type === 'investissement-participatif';

    await actionnaireAggrégat.enregistrerChangement({
      identifiantProjet,
      identifiantUtilisateur,
      actionnaire,
      dateChangement,
      pièceJustificative,
      raison,
      estAbandonné: abandon.statut.estAccordé(),
      estAchevé: achèvement.estAchevé(),
      demandeAbandonEnCours: abandon.statut.estEnCours(),
      estParticipatif,
      aDesGarantiesFinancièresConstituées: !!garantiesFinancières?.actuelles,
      aUnDépotEnCours: !!garantiesFinancières?.dépôtsEnCours,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.EnregistrerChangement', handler);
};
