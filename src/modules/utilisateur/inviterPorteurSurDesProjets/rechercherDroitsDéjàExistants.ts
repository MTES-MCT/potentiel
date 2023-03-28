export type RechercherDroitsDéjàExistantsQuery = { email: string; projectIds: string[] };

export type RechercherDroitsDéjàExistantsQueryHandler = (
  query: RechercherDroitsDéjàExistantsQuery,
) => Promise<string[]>;
