import React from 'react'

import AdminDashboard from './adminDashboard'

export default { title: 'Button' }

export const empty = () => <AdminDashboard adminName="Roger Rabbit" />

export const withError = () => (
  <AdminDashboard adminName="Roger Rabbit" error="This is an error message!" />
)

export const withSuccess = () => (
  <AdminDashboard
    adminName="Roger Rabbit"
    success="This is a success message!"
  />
)

const projects = [
  {
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
  },
  {
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
    classe: 'Classé' as 'Classé',
    motifsElimination: ''
  }
]

export const withProjects = () => (
  <AdminDashboard adminName="Roger Rabbit" projects={projects} />
)
