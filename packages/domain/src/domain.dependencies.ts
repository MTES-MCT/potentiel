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

import { RaccordementDependencies } from './raccordement/raccordement.dependencies';

export type DomainDependencies = {
  subscribe: Subscribe;
  command: {
    publish: Publish;
    loadAggregate: LoadAggregate;
  };
  query: {
    find: Find;
    list: List;
  };
  event: {
    create: Create;
    update: Update;
    find: Find;
    remove: Remove;
  };
  raccordement: RaccordementDependencies;
};
