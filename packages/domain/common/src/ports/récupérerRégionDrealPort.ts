import { Option } from '@potentiel-librairies/monads';

export type RécupérerRégionDrealPort = (
  identifiantUtilisateur: string,
) => Promise<Option.Type<{ région: string }>>;
