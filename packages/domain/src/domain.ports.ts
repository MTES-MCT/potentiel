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

export type Ports = {
  commandPorts: {
    publish: Publish;
    loadAggregate: LoadAggregate;
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
