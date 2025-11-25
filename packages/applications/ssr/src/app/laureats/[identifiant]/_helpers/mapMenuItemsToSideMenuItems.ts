import { SideMenuProps } from '@codegouvfr/react-dsfr/SideMenu';

type MenuItem = {
  label: string;
  children?: MenuItem[];
  href?: string;
};

export const menuItems: Array<MenuItem> = [
  {
    href: '',
    label: "Vue d'ensemble",
  },
  {
    label: 'Informations Générales',
    children: [
      {
        href: `informations-generales`,
        label: 'Informations générales',
      },
      {
        href: `administratif`,
        label: 'Administratif',
      },
      {
        href: `evaluation-carbone`,
        label: 'Évaluation carbone',
      },
      {
        href: `installation`,
        label: 'Installation',
      },
      {
        href: `raccordements`,
        label: 'Raccordement',
      },
      {
        href: `garanties-financieres`,
        label: 'Garanties financières',
      },
    ],
  },
  {
    href: `historique`,
    label: 'Historique',
  },
  {
    href: `contacts`,
    label: 'Contacts',
  },
  {
    href: `documents`,
    label: 'Documents',
  },
];

export const mapMenuItemsToSideMenuItems = (
  menuItems: Array<MenuItem>,
  baseUrl: string,
  currentPath: string,
): SideMenuProps.Item[] => {
  return menuItems.map((item) => {
    if (item.children) {
      return {
        text: item.label,
        items: mapMenuItemsToSideMenuItems(item.children, baseUrl, currentPath),
        isActive: item.href === currentPath,
      };
    } else {
      return {
        text: item.label,
        linkProps: {
          href: `${baseUrl}/${item.href}`,
        },
        isActive: item.href === currentPath,
      };
    }
  });
};
