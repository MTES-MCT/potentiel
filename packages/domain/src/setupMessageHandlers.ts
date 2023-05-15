import { Find, List, LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  registerAjouterGestionnaireRéseauCommand,
  registerConsulterGestionnaireRéseauQuery,
  registerListerGestionnaireRéseauQuery,
  registerModifierGestionnaireRéseauCommand,
} from './gestionnaireRéseau';
import { registerConsulterProjetQuery } from './projet';
import {
  registerConsulterDossierRaccordementQuery,
  registerListerDossiersRaccordementQuery,
  registerModifierDemandeComplèteRaccordementCommand,
  registerModifierGestionnaireRéseauProjetCommand,
  registerModifierPropositionTechniqueEtFinancièreCommand,
  registerTransmettreDemandeComplèteRaccordementCommand,
  registerTransmettrePropositionTechniqueEtFinancièreCommand,
} from './raccordement';

type Ports = {
  commandPorts: {
    publish: Publish;
    loadAggregate: LoadAggregate;
  };
  queryPorts: {
    find: Find;
    list: List;
  };
};

export const setupMessageHandlers = async ({
  commandPorts: eventStreamPort,
  queryPorts: projectionPort,
}: Ports) => {
  registerCommands(eventStreamPort);
  registerQueries(projectionPort);
};

const registerCommands = (ports: Ports['commandPorts']) => {
  // Gestionnaire de réseau
  registerAjouterGestionnaireRéseauCommand(ports);
  registerModifierGestionnaireRéseauCommand(ports);

  // Projet
  registerModifierGestionnaireRéseauProjetCommand(ports);

  // Dossier de raccordement
  registerModifierDemandeComplèteRaccordementCommand(ports);
  registerModifierPropositionTechniqueEtFinancièreCommand(ports);
  registerTransmettrePropositionTechniqueEtFinancièreCommand(ports);
  registerTransmettreDemandeComplèteRaccordementCommand(ports);
};

const registerQueries = (ports: Ports['queryPorts']) => {
  // Gestionnaire de réseau
  registerConsulterGestionnaireRéseauQuery(ports);
  registerListerGestionnaireRéseauQuery(ports);

  // Projet
  registerConsulterProjetQuery(ports);

  // Dossier de raccordement
  registerConsulterDossierRaccordementQuery(ports);
  registerListerDossiersRaccordementQuery(ports);
};
