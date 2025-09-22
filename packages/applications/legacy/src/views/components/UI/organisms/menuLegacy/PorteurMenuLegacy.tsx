import React from 'react';
import routes from '../../../../../routes';
import { Header } from '../Header';
import { DropdownMenu } from '../../molecules/dropdowns/DropdownMenu';
import { Routes } from '@potentiel-applications/routes';
import { MenuGarantiesFinancières } from './_utils/garantiesFinancières.menuLegacy';

export const PorteurMenuLegacy = (
  <>
    <DropdownMenu buttonChildren={'Projets'}>
      <DropdownMenu.DropdownItem href={Routes.Lauréat.lister()}>
        Projets lauréats
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Projet.lister()}>
        Tous les projets (legacy)
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <DropdownMenu buttonChildren={'Demandes'}>
      <DropdownMenu.DropdownItem
        href={Routes.Abandon.lister({
          statut: ['demandé', 'en-instruction', 'confirmé', 'confirmation-demandée'],
        })}
      >
        Abandon
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Recours.lister({ statut: ['demandé', 'en-instruction'] })}
      >
        Recours
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.ReprésentantLégal.changement.lister({ statut: ['demandé'] })}
      >
        Représentant légal
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Actionnaire.changement.lister({ statut: ['demandé'] })}
      >
        Actionnaire
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Puissance.changement.lister({ statut: ['demandé'] })}>
        Puissance
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Producteur.changement.lister}>
        Producteur
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem href={Routes.Fournisseur.changement.lister}>
        Fournisseur
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={Routes.Délai.lister({ statut: ['demandé', 'en-instruction'] })}
      >
        Délai
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <MenuGarantiesFinancières />
    <Header.MenuItem href={Routes.Utilisateur.réclamerProjet}>Projets à réclamer</Header.MenuItem>
  </>
);
