import { SideMenuProps } from '@codegouvfr/react-dsfr/SideMenu';

export type MenuItem = {
  label: string;
  children?: MenuItem[];
  href?: string;
};

export const baseMenuItems: Array<MenuItem> = [
  {
    href: '',
    label: 'Tableau de bord',
  },
  {
    label: 'Détails du projet',
    children: [
      {
        href: `informations-generales`,
        label: 'Informations générales',
      },
      {
        href: `evaluation-carbone`,
        label: 'Évaluation carbone',
      },
      {
        href: `installation`,
        label: 'Installation',
      },
    ],
  },
  {
    label: 'Actions',
    children: [
      // seulement pour porteur, admin et dreal
      // est ce nécessaire de restreindre pour les autres rôles ?
      {
        href: `imprimer`,
        label: 'Imprimer la page',
      },
    ],
  },
  {
    label: 'Tâches',
    href: 'taches',
  },
  {
    href: `historique`,
    label: 'Historique',
  },
  {
    href: `utilisateurs`,
    label: 'Utilisateurs',
  },
];

export const mapMenuItemsToSideMenuItems = (
  menuItems: Array<MenuItem>,
  baseUrl: string,
  currentPath: string,
  nombreTâches?: number,
): SideMenuProps.Item[] => {
  return menuItems.map((item) => {
    if (item.children) {
      return {
        text: item.label,
        items: mapMenuItemsToSideMenuItems(item.children, baseUrl, currentPath, nombreTâches),
        isActive: item.href === currentPath,
      };
    } else {
      return {
        text: item.label === 'Tâches' ? `${item.label} (${nombreTâches})` : item.label,
        linkProps: {
          href: `${baseUrl}/${item.href}`,
        },
        isActive: item.href === currentPath,
      };
    }
  });
};
