export type LegacyProject = {
  appelOffreId: string;
  periodeId: string;
  familleId: string;
  numeroCRE: string;
  notifiedOn: number;
  abandonedOn: number;
  classe: string;
  nomProjet: string;
  communeProjet: string;
  departementProjet: string;
  regionProjet: string;
};

export type LegacyProjectRepository = {
  findOne: (options: {
    where?: Partial<LegacyProject>;
    attributes?: Array<string>;
  }) => Promise<LegacyProject | undefined>;
};
