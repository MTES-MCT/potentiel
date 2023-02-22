import React from 'react';
import { Header } from './Header';

export default { title: 'Components/Header' };

export const HeaderPourPorteurDeProjet = () => (
  <Header
    {...{
      user: {
        accountUrl: 'http://account.test',
        id: 'fake-id',
        email: 'email@email.test',
        fullName: 'Porteur Projet',
        role: 'porteur-projet',
        permissions: [],
      },
    }}
  />
);

export const HeaderPourPorteurDeProjetSansNom = () => (
  <Header
    {...{
      user: {
        accountUrl: 'http://account.test',
        id: 'fake-id',
        email: 'email@email.test',
        fullName: '',
        role: 'porteur-projet',
        permissions: [],
      },
    }}
  />
);

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
        permissions: [],
      },
    }}
  />
);

export const HeaderPourAdmin = () => (
  <Header
    {...{
      user: {
        accountUrl: 'http://account.test',
        id: 'fake-id',
        email: 'email@email.test',
        fullName: 'Administrateur',
        role: 'admin',
        permissions: [],
      },
    }}
  />
);
export const HeaderPourAdminSansNom = () => (
  <Header
    {...{
      user: {
        accountUrl: 'http://account.test',
        id: 'fake-id',
        email: 'email@email.test',
        fullName: '',
        role: 'admin',
        permissions: [],
      },
    }}
  />
);

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
        permissions: [],
      },
    }}
  />
);
