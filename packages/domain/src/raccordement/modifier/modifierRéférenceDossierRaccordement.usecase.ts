import { mediator, MessageHandler, Message } from 'mediateur';
import { RaccordementCommand } from '../raccordement.command';
import { ModifierRéférenceDossierRaccordementCommand } from './modifierRéférenceDossierRaccordement.command';

type ModifierRéférenceDossierRaccordementUseCaseData =
  ModifierRéférenceDossierRaccordementCommand['data'];

export type ModifierRéférenceDossierRaccordementUseCase = Message<
  'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_USE_CASE',
  ModifierRéférenceDossierRaccordementUseCaseData
>;

export const registerModifierRéférenceDossierRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierRéférenceDossierRaccordementUseCase> = async (data) => {
    await mediator.send<RaccordementCommand>({
      type: 'MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_COMMAND',
      data,
    });
  };

  mediator.register('MODIFIER_RÉFÉRENCE_DOSSIER_RACCORDEMENT_USE_CASE', runner);
};
