import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

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

export type RécupérerTypeActionnariatParIdentifiantProjetPort = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<
  Option.Type<{
    isFinancementParticipatif: boolean;
    isInvestissementParticipatif: boolean;
  }>
>;

export type ModifierActionnaireDependencies = {
  loadAggregate: LoadAggregate;
  récupérerTypeActionnariatParIdentifiantProjet: RécupérerTypeActionnariatParIdentifiantProjetPort;
};

export const registerModifierActionnaireCommand = ({
  loadAggregate,
  récupérerTypeActionnariatParIdentifiantProjet,
}: ModifierActionnaireDependencies) => {
  const loadActionnaire = loadActionnaireFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const loadAchèvement = loadAchèvementFactory(loadAggregate);
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
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

    if (identifiantProjet.appelOffre === 'Eolien') {
      const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
      const project = await récupérerTypeActionnariatParIdentifiantProjet(identifiantProjet);

      devraitPasserParUneDemande = !!(
        garantiesFinancières?.actuelles ||
        garantiesFinancières?.dépôtsEnCours ||
        (Option.isSome(project) &&
          (project.isFinancementParticipatif || project.isInvestissementParticipatif))
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
