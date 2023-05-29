import { Subscribe } from '@potentiel/core-domain';
import { ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies } from './consulterAccuséRéception/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import { EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies } from './enregisterAccuséRéception/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';
import { ModifierDemandeComplèteRaccordementDependencies } from './modifier/modifierDemandeComplèteRaccordement.command';
import { SupprimerAccuséRéceptionDemandeComplèteRaccordementDependencies } from './supprimerAccuséRéception/supprimerAccuséRéceptionDemandeComplèteRaccordement.command';
import { RenommerAccuséRéceptionDemandeComplèteRaccordementDependencies } from './renommerAccuséRéception/renommerAccuséRéceptionDemandeComplèteRaccordement.command';
import { TransmettreDemandeComplèteRaccordementDependencies } from './transmettre/transmettreDemandeComplèteRaccordement.command';
import { AccuséRéceptionDemandeComplèteRaccordementSuppriméDependencies } from './supprimerAccuséRéception/handlers/accuséRéceptionDemandeComplèteRaccordementSupprimé.handler';
import { DemandeComplèteRaccordementTransmiseHandlerFactoryDependencies } from './transmettre/handlers/demandeComplèteRaccordementTransmise.handler';
import { DemandeComplèteRaccordementeModifiéeDependencies } from './modifier/handlers/demandeComplèteRaccordementModifiée.handler';
import { AccuséRéceptionDemandeComplèteRaccordementTransmisDependencies } from './enregisterAccuséRéception/handlers/accuséRéceptionDemandeComplèteRaccordementTransmis.handler';
import { MettreAJourAccuséRéceptionDemandeComplèteRaccordementDependencies } from './mettreAJourAccuséRéception/mettreAJourAccuséRéceptionDemandeComplèteRaccordement.command';
type QueryHandlerDependencies = ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies;

type CommandHandlerDependencies =
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies &
    SupprimerAccuséRéceptionDemandeComplèteRaccordementDependencies &
    TransmettreDemandeComplèteRaccordementDependencies &
    RenommerAccuséRéceptionDemandeComplèteRaccordementDependencies &
    ModifierDemandeComplèteRaccordementDependencies &
    MettreAJourAccuséRéceptionDemandeComplèteRaccordementDependencies;

type EventHandlerDependencies = AccuséRéceptionDemandeComplèteRaccordementTransmisDependencies &
  AccuséRéceptionDemandeComplèteRaccordementSuppriméDependencies &
  DemandeComplèteRaccordementTransmiseHandlerFactoryDependencies &
  DemandeComplèteRaccordementeModifiéeDependencies;

export type DemandeComplèteRaccordementDependencies = {
  subscribe: Subscribe;
} & QueryHandlerDependencies &
  CommandHandlerDependencies &
  EventHandlerDependencies;
