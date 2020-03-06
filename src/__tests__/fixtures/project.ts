export default function makeFakeProject(overrides) {
  const defaultObj = {
    id: '1',
    periode: 'periode',
    numeroCRE: 'numeroCRE',
    famille: 'famille',
    nomCandidat: 'nomCandidat',
    nomProjet: 'nomProjet',
    puissance: 12765,
    prixReference: 87.9,
    evaluationCarbone: 4.4,
    note: 11,
    nomRepresentantLegal: 'nomRepresentantLegal',
    email: 'email',
    adresseProjet: 'adresseProjet',
    codePostalProjet: 'codePostalProjet',
    communeProjet: 'communeProjet',
    departementProjet: 'departementProjet',
    regionProjet: 'regionProjet',
    classe: 'Eliminé' as 'Eliminé',
    motifsElimination: 'motifsElimination'
  }

  return {
    ...defaultObj,
    ...overrides
  }
}
