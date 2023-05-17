import {
  Create,
  Find,
  List,
  LoadAggregate,
  Publish,
  Remove,
  Subscribe,
  Update,
} from '@potentiel/core-domain';
import {
  EnregistrerAccuséRéceptionDemandeComplèteRaccordement,
  EnregistrerFichierPropositionTechniqueEtFinancière,
} from './raccordement';

export type Ports = {
  commandPorts: {
    publish: Publish;
    loadAggregate: LoadAggregate;
    enregistrerFichierPropositionTechniqueEtFinancière: EnregistrerFichierPropositionTechniqueEtFinancière;
    enregistrerAccuséRéceptionDemandeComplèteRaccordement: EnregistrerAccuséRéceptionDemandeComplèteRaccordement;
  };
  queryPorts: {
    find: Find;
    list: List;
  };
  eventPorts: {
    create: Create;
    update: Update;
    find: Find;
    remove: Remove;
  };
  subscribe: Subscribe;
};
