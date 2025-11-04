import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, DateTime } from '@potentiel-domain/common';

import { Utilisateur } from '..';

import { ModifierRôleUtilisateurCommand } from './modifierRôleUtilisateur.command';

export type ModifierRôleUtilisateurUseCase = Message<
  'Utilisateur.UseCase.ModifierRôleUtilisateur',
  {
    identifiantUtilisateurValue: string;
    nouveauRôleValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;

    fonctionValue?: string;
    nomCompletValue?: string;
    régionValue?: string;
    identifiantGestionnaireRéseauValue?: string;
    zoneValue?: string;
  }
>;

export const registerModifierRôleUseCase = () => {
  const runner: MessageHandler<ModifierRôleUtilisateurUseCase> = async ({
    identifiantUtilisateurValue,
    nouveauRôleValue,
    modifiéLeValue,
    modifiéParValue,
    fonctionValue: fonction,
    nomCompletValue: nomComplet,
    régionValue,
    identifiantGestionnaireRéseauValue: identifiantGestionnaireRéseau,
    zoneValue,
  }) => {
    const nouvelUtilisateur = Utilisateur.convertirEnValueType({
      identifiantUtilisateur: identifiantUtilisateurValue,
      rôle: nouveauRôleValue,
      fonction,
      nomComplet,
      région: régionValue,
      identifiantGestionnaireRéseau,
      zone: zoneValue,
    });
    const modifiéLe = DateTime.convertirEnValueType(modifiéLeValue);
    const modifiéPar = Email.convertirEnValueType(modifiéParValue);

    await mediator.send<ModifierRôleUtilisateurCommand>({
      type: 'Utilisateur.Command.ModifierRôleUtilisateur',
      data: {
        nouvelUtilisateur,
        modifiéLe,
        modifiéPar,
      },
    });
  };

  mediator.register('Utilisateur.UseCase.ModifierRôleUtilisateur', runner);
};
