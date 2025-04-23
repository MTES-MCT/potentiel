import { match, P } from 'ts-pattern';

import { Role } from '@potentiel-domain/utilisateur';

export const canConnectWithProvider = (provider: string, role: Role.RawType) => {
  const tousSaufDgecDreal = P.not(P.union(Role.admin.nom, Role.dreal.nom, Role.dgecValidateur.nom));
  return match({ provider, role })
    .with({ role: tousSaufDgecDreal }, () => true)
    .with({ provider: 'proconnect' }, () => true)
    .otherwise(
      ({ provider }) =>
        process.env.NEXTAUTH_PROVIDERS_DREAL_DGEC?.split(',')
          .map((str) => str.trim().toLowerCase())
          ?.includes(provider) ?? false,
    );
};
