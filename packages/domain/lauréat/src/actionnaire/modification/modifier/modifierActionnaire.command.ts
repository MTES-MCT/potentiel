import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/candidature';

import { loadActionnaireFactory } from '../../actionnaire.aggregate';
import { loadAbandonFactory } from '../../../abandon';
import { loadAchèvementFactory } from '../../../achèvement/achèvement.aggregate';
import { loadGarantiesFinancièresFactory } from '../../../garantiesFinancières/garantiesFinancières.aggregate';

export type ModifierActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.ModifierActionnaire',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    actionnaire: string;
    dateModification: DateTime.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
    rôle: Role.ValueType;
    raison: string;
  }
>;

export const registerModifierActionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<ModifierActionnaireCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    actionnaire,
    dateModification,
    pièceJustificative,
    rôle,
    raison,
  }) => {
    const actionnaireAggrégat = await loadActionnaire(identifiantProjet);
    const abandon = await loadAbandon(identifiantProjet, false);
    const achèvement = await loadAchèvement(identifiantProjet, false);
    const utilisateurEstPorteur = rôle.estÉgaleÀ(Role.porteur);
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);

    // quickwin : nous passons ici par un appel à l'agrégat candidature au lieu de projet
    // cela devrait être repris quand les types d'actionnariat seront migrés dans l'aggregat Actionnaire
    // Par ailleurs les données sont les mêmes à date (janv 2025)
    const candidature = await loadCandidature(identifiantProjet);

    const estParticipatif =
      candidature.typeActionnariat?.type === 'financement-participatif' ||
      candidature.typeActionnariat?.type === 'investissement-participatif';

    await actionnaireAggrégat.modifier({
      identifiantProjet,
      identifiantUtilisateur,
      actionnaire,
      dateModification,
      pièceJustificative,
      raison,
      utilisateurEstPorteur,
      estAbandonné: abandon.statut.estAccordé(),
      estAchevé: achèvement.estAchevé(),
      demandeAbandonEnCours: abandon.statut.estEnCours(),
      estParticipatif,
      aDesGarantiesFinancièresConstituées: !!garantiesFinancières?.actuelles,
      aUnDépotEnCours: !!garantiesFinancières?.dépôtsEnCours,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.ModifierActionnaire', handler);
};
