import { Subscribe } from '@potentiel/core-domain';
import {
  ModifierGestionnaireRéseauProjetDependencies,
  registerModifierGestionnaireRéseauProjetCommand,
} from './gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.command';
import { registerModifierGestionnaireRéseauProjetUseCase } from './gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.usecase';
import { DemandeComplèteRaccordementTransmiseEvent } from '../raccordement/raccordement.event';
import { mediator } from 'mediateur';
import {
  ExecuterAjouterGestionnaireRéseauProjetSaga,
  registerExecuterAjouterGestionnaireRéseauProjetSaga,
} from './gestionnaireRéseau/déclarer/déclarerGestionnaireRéseau.saga';
import { registerDéclarerGestionnaireRéseauProjetCommand } from './gestionnaireRéseau/déclarer/déclarerGestionnaireRéseauProjet.command';
import { registerEnregistrerGarantiesFinancièresUseCase } from './garantiesFinancières/enregistrerGarantiesFinancières.usecase';
import {
  EnregistrerTypeGarantiesFinancièresDependencies,
  registerEnregistrerTypeGarantiesFinancièresCommand,
} from './garantiesFinancières/enregistrerTypeGarantiesFinancières.command';
import {
  EnregistrerAttestationGarantiesFinancièresDependencies,
  registerEnregistrerAttestationGarantiesFinancièresCommand,
} from './garantiesFinancières/enregistrerAttestationGarantiesFinancières.command';
import { registerEnregistrerGarantiesFinancièresComplètesCommand } from './garantiesFinancières/enregistrerGarantiesFinancièresComplètes.command';

export type ProjetDependencies = {
  subscribe: Subscribe;
} & ModifierGestionnaireRéseauProjetDependencies &
  EnregistrerTypeGarantiesFinancièresDependencies &
  EnregistrerAttestationGarantiesFinancièresDependencies;

export const setupProjet = async (dependencies: ProjetDependencies) => {
  // Commands
  registerModifierGestionnaireRéseauProjetCommand(dependencies);
  registerDéclarerGestionnaireRéseauProjetCommand(dependencies);
  registerEnregistrerTypeGarantiesFinancièresCommand(dependencies);
  registerEnregistrerAttestationGarantiesFinancièresCommand(dependencies);
  registerEnregistrerGarantiesFinancièresComplètesCommand(dependencies);

  // Use cases
  registerModifierGestionnaireRéseauProjetUseCase();
  registerEnregistrerGarantiesFinancièresUseCase();

  // Sagas
  registerExecuterAjouterGestionnaireRéseauProjetSaga();

  // Sagas
  const { subscribe } = dependencies;

  return [
    await subscribe<DemandeComplèteRaccordementTransmiseEvent>(
      ['DemandeComplèteDeRaccordementTransmise'],
      async (event: DemandeComplèteRaccordementTransmiseEvent) => {
        await mediator.send<ExecuterAjouterGestionnaireRéseauProjetSaga>({
          type: 'EXECUTER_DÉCLARER_GESTIONNAIRE_RÉSEAU_PROJET_SAGA',
          data: event,
        });
      },
    ),
  ];
};
