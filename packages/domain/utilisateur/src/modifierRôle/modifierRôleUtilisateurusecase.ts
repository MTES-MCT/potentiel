import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, DateTime } from '@potentiel-domain/common';

import { Role, Région, Zone } from '..';

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
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const nouveauRôle = Role.convertirEnValueType(nouveauRôleValue);
    const modifiéLe = DateTime.convertirEnValueType(modifiéLeValue);
    const modifiéPar = Email.convertirEnValueType(modifiéParValue);
    const région = régionValue ? Région.convertirEnValueType(régionValue) : undefined;
    const zone = zoneValue ? Zone.convertirEnValueType(zoneValue) : undefined;

    await mediator.send<ModifierRôleUtilisateurCommand>({
      type: 'Utilisateur.Command.ModifierRôleUtilisateur',
      data: {
        identifiantUtilisateur,
        nouveauRôle,
        modifiéLe,
        modifiéPar,
        fonction,
        nomComplet,
        région,
        identifiantGestionnaireRéseau,
        zone,
      },
    });
  };

  mediator.register('Utilisateur.UseCase.ModifierRôleUtilisateur', runner);
};
