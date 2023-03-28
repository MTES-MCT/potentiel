export type RechercherDroitsDéjàExistantsQuery = { email: string; projectIds: string[] };

export type RechercherDroitsDéjàExistantsQueryQueryHandler = (
  query: RechercherDroitsDéjàExistantsQuery,
) => Promise<null | string[]>;
