import { SideMenuProps } from '@codegouvfr/react-dsfr/SideMenu';

type MenuItem = {
  label: string;
  children?: MenuItem[];
  href?: string;
};

export const menuItems: Array<MenuItem> = [
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
      {
        href: `raccordements`,
        label: 'Page raccordement',
      },
      {
        href: `garanties-financieres`,
        label: 'Page garanties financières',
      },
    ],
  },
  // TODO: à travailler
  {
    label: 'Actions',
    children: [],
  },
  {
    href: `historique`,
    label: 'Historique',
  },
  {
    href: `utilisateurs`,
    label: 'Utilisateurs',
  },
  // TODO: V2
  // {
  //   href: `mes-documents`,
  //   label: 'Mes Documents',
  // },
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
