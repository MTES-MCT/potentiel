import React from 'react';
import routes from '../../../../../routes';
import { Header } from '../Header';

export const CaisseDesDépôtsMenuLegacy = (currentPage?: string) => (
  <Header.MenuItem
    href={routes.LISTE_PROJETS}
    {...(currentPage === 'list-projects' && { isCurrent: true })}
  >
    Projets
  </Header.MenuItem>
);
