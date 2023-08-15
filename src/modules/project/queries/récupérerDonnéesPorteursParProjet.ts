import { User } from '../../../entities';

type RécupérerDonnéesPorteursParProjetQuery = { projetId: string };

type RécupérerDonnéesPorteursParProjetReadModel = Array<User>;

export type RécupérerDonnéesPorteursParProjetQueryHandler = (
  query: RécupérerDonnéesPorteursParProjetQuery,
) => Promise<RécupérerDonnéesPorteursParProjetReadModel>;
