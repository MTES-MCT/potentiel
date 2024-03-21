import { Option } from '@potentiel/monads';

export type RécupérerRégionDrealPort = (
  identifiantUtilisateur: string,
) => Promise<Option.Type<{ région: string }>>;
