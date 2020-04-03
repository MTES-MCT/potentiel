export default function makeFakeProject(overrides?) {
  const defaultObj = {
    appelOffreId: 'fessenheim',
    periodeId: '6',
    numeroCRE: 'CRE#12335',
    familleId: '1',
    nomCandidat: 'Mr Porter',
    nomProjet: 'Mon projet PV',
    puissance: 12765,
    prixReference: 87.9,
    evaluationCarbone: 4.4,
    note: 11,
    nomRepresentantLegal: 'nomRepresentantLegal',
    email: 'email@address.com',
    adresseProjet: 'adresseProjet',
    codePostalProjet: 'codePostalProjet',
    communeProjet: 'communeProjet',
    departementProjet: 'departementProjet',
    regionProjet: 'regionProjet',
    classe: 'Eliminé' as 'Eliminé',
    motifsElimination: 'motifsElimination',
    fournisseur: 'Mon fournisseur',
    actionnaire: 'Mon actionnaire',
    producteur: 'Mon producteur'
  }

  return {
    ...defaultObj,
    ...overrides
  }
}
