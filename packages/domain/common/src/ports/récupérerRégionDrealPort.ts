import { Option } from '@potentiel-libraries/monads';

export type RécupérerRégionDrealPort = (
  identifiantUtilisateur: string,
) => Promise<Option.Type<{ région: string }>>;
