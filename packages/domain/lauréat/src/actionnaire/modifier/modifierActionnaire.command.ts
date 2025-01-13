import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/candidature';

import { loadActionnaireFactory } from '../actionnaire.aggregate';
import { loadAbandonFactory } from '../../abandon';
import { loadAchèvementFactory } from '../../achèvement/achèvement.aggregate';
import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières/garantiesFinancières.aggregate';

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
    let devraitPasserParUneDemande = false;

    if (identifiantProjet.appelOffre === 'Eolien' && utilisateurEstPorteur) {
      const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
      // quickwin : nous passons ici par un appel à l'agrégat candidature au lieu de projet
      // cela devrait être repris quand les types d'actionnariat seront migrés
      // Par ailleurs les données sont les mêmes à date (janv 2025)
      const candidature = await loadCandidature(identifiantProjet);

      devraitPasserParUneDemande = !!(
        (!garantiesFinancières?.actuelles && !garantiesFinancières?.dépôtsEnCours) ||
        candidature.typeActionnariat?.estÉgaleÀ(
          Candidature.TypeActionnariat.financementParticipatif,
        ) ||
        candidature.typeActionnariat?.estÉgaleÀ(
          Candidature.TypeActionnariat.investissementParticipatif,
        )
      );
    }

    await actionnaireAggrégat.modifier({
      identifiantProjet,
      identifiantUtilisateur,
      actionnaire,
      dateModification,
      pièceJustificative,
      raison,
      estAbandonnéEtUtilisateurEstPorteur: abandon.statut.estAccordé() && utilisateurEstPorteur,
      estAchevéEtUtilisateurEstPorteur: achèvement.estAchevé() && utilisateurEstPorteur,
      demandeAbandonEnCoursEtUtilisateurEstPorteur:
        abandon.statut.estEnCours() && utilisateurEstPorteur,
      devraitPasserParUneDemande,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.ModifierActionnaire', handler);
};
