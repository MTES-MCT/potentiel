import { v4 as uuid } from 'uuid'

export default function makeFakeProject(overrides?) {
  const defaultObj = {
    id: uuid(),
    appelOffreId: 'Fessenheim',
    periodeId: '2',
    numeroCRE: Math.ceil(Math.random() * 1000).toString(),
    familleId: '1',
    nomCandidat: 'Mr Porter',
    nomProjet: 'Mon projet PV',
    puissance: 100,
    puissanceInitiale: 100,
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
    isInvestissementParticipatif: false,
    isFinancementParticipatif: false,
    engagementFournitureDePuissanceAlaPointe: false,
    newRulesOptIn: false,
  }

  const project = {
    ...defaultObj,
    ...overrides,
  }

  return {
    ...project,
    potentielIdentifier: 'potentielIdentifer',
  }
}
