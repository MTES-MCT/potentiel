import { match, P } from 'ts-pattern';

import { Role } from '@potentiel-domain/utilisateur';

export const canConnectWithProvider = (provider: string, role: Role.RawType) => {
  const tousSaufDgecDreal = P.not(P.union(Role.admin.nom, Role.dreal.nom, Role.dgecValidateur.nom));
  return match({ provider, role })
    .with({ provider: 'email', role: tousSaufDgecDreal }, () => true)
    .with({ provider: 'keycloak' }, () => true)
    .with({ provider: 'proconnect' }, () => true)
    .otherwise(() => false);
};
