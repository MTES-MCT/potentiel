import React from 'react';
import routes from '../../../../../routes';
import { Header } from '../Header';

export const AdemeMenuLegacy = (currentPage?: string) => (
  <>
    <Header.MenuItem
      href={routes.LISTE_PROJETS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Projets
    </Header.MenuItem>
    <Header.MenuItem
      href={routes.ADEME_STATISTIQUES}
      {...(currentPage === 'ademe-statistiques' && { isCurrent: true })}
    >
      Tableau de bord
    </Header.MenuItem>
  </>
);
