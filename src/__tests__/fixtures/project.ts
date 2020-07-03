import { v1 as uuid } from 'uuid'

export default function makeFakeProject(overrides?) {
  const defaultObj = {
    id: uuid(),
    appelOffreId: 'Fessenheim',
    periodeId: '6',
    numeroCRE: Math.ceil(Math.random() * 1000),
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
    isInvestissementParticipatif: false,
    isFinancementParticipatif: false,
    engagementFournitureDePuissanceAlaPointe: false,
  }

  return {
    ...defaultObj,
    ...overrides,
  }
}
