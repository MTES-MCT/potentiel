import React from 'react'
import { Header } from './Header'

export default { title: 'Components/Header' }

export const HeaderPourPorteurDeProjet = () => (
  <Header
    {...{
      user: {
        accountUrl: 'http://account.test',
        id: 'fake-id',
        email: 'email@email.test',
        fullName: 'Porteur Projet',
        role: 'porteur-projet',
      },
    }}
  />
)

export const HeaderPourPorteurDeProjetSansNom = () => (
  <Header
    {...{
      user: {
        accountUrl: 'http://account.test',
        id: 'fake-id',
        email: 'email@email.test',
        fullName: '',
        role: 'porteur-projet',
      },
    }}
  />
)

export const HeaderPourPorteurDeProjetAvecUnTrèsLongNom = () => (
  <Header
    {...{
      user: {
        accountUrl: 'http://account.test',
        id: 'fake-id',
        email: 'email@email.test',
        fullName:
          'Porteur Projet Porteur Projet Porteur Projet Porteur Projet Porteur Projet Porteur Projet Porteur Projet',
        role: 'porteur-projet',
      },
    }}
  />
)

export const HeaderPourAdmin = () => (
  <Header
    {...{
      user: {
        accountUrl: 'http://account.test',
        id: 'fake-id',
        email: 'email@email.test',
        fullName: 'Administrateur',
        role: 'admin',
      },
    }}
  />
)
export const HeaderPourAdminSansNom = () => (
  <Header
    {...{
      user: {
        accountUrl: 'http://account.test',
        id: 'fake-id',
        email: 'email@email.test',
        fullName: '',
        role: 'admin',
      },
    }}
  />
)

export const HeaderPourAdminAvecUnTrèsLongNom = () => (
  <Header
    {...{
      user: {
        accountUrl: 'http://account.test',
        id: 'fake-id',
        email: 'email@email.test',
        fullName:
          'AdministrateurAdministrateurAdministrateurAdministrateurAdministrateurAdministrateurAdministrateur',
        role: 'admin',
      },
    }}
  />
)
