export const fakeLegacyProject = {
  appelOffreId: 'fake',
  periodeId: 'fake',
  familleId: 'fake',
  numeroCRE: 'fake',
  notifiedOn: 12345,
  abandonedOn: 67890,
  classe: 'fake',
  nomProjet: 'fake',
  communeProjet: 'fake',
  departementProjet: 'fake',
  regionProjet: 'fake',
};

export const legacyProjectRepository = {
  findOne: () => Promise.resolve(fakeLegacyProject),
};
