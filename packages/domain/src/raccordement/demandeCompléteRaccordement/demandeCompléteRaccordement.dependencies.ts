import { Subscribe } from '@potentiel/core-domain';
import { ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies } from './consulterAccuséRéception/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies } from './enregisterAccuséRéception/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';
import { ModifierDemandeComplèteRaccordementDependencies } from './modifier/modifierDemandeComplèteRaccordement.command';
import { TransmettreDemandeComplèteRaccordementDependencies } from './transmettre/transmettreDemandeComplèteRaccordement.command';
import { DemandeComplèteRaccordementTransmiseHandlerFactoryDependencies } from './transmettre/handlers/demandeComplèteRaccordementTransmise.handler';
import { DemandeComplèteRaccordementeModifiéeDependencies } from './modifier/handlers/demandeComplèteRaccordementModifiée.handler';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisDependencies } from './enregisterAccuséRéception/handlers/accuséRéceptionDemandeComplèteRaccordementTransmis.handler';
import { ModifierAccuséRéceptionDemandeComplèteRaccordementDependencies } from './modifierAccuséRécéption/modifierAccuséRéceptionDemandeComplèteRaccordement.command';
type QueryHandlerDependencies = ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies;

type CommandHandlerDependencies =
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies &
    ModifierAccuséRéceptionDemandeComplèteRaccordementDependencies &
    TransmettreDemandeComplèteRaccordementDependencies &
    ModifierDemandeComplèteRaccordementDependencies;

type EventHandlerDependencies = AccuséRéceptionDemandeComplèteRaccordementTransmisDependencies &
  DemandeComplèteRaccordementTransmiseHandlerFactoryDependencies &
  DemandeComplèteRaccordementeModifiéeDependencies;

export type DemandeComplèteRaccordementDependencies = {
  subscribe: Subscribe;
} & QueryHandlerDependencies &
  CommandHandlerDependencies &
  EventHandlerDependencies;
