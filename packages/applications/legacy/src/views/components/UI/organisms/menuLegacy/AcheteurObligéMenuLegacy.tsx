import React from 'react';
import routes from '../../../../../routes';
import { DropdownMenu } from '../../molecules/dropdowns/DropdownMenu';
import { Routes } from '@potentiel-applications/routes';

export const AcheteurObligéMenuLegacy = (
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
  </>
);
