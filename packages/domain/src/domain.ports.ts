import { Find, List, LoadAggregate, Publish } from '@potentiel/core-domain';

export type Ports = {
  commandPorts: {
    publish: Publish;
    loadAggregate: LoadAggregate;
  };
  queryPorts: {
    find: Find;
    list: List;
  };
};
