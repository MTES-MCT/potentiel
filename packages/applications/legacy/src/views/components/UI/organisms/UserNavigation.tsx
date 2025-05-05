import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  AcheteurObligéMenuLegacy,
  AdemeMenuLegacy,
  AdminMenuLegacy,
  CaisseDesDépôtsMenuLegacy,
  CreMenuLegacy,
  PorteurMenuLegacy,
  DrealMenuLegacy,
  GrdMenuLegacy,
} from './menuLegacy';

type UserNavigationProps = {
  user: UtilisateurReadModel;
  currentPage?: string;
};
export const UserNavigation = ({ user: { role, features }, currentPage }: UserNavigationProps) => {
  switch (role) {
    case 'porteur-projet':
      return PorteurMenuLegacy({ currentPage, features });
    case 'acheteur-obligé':
      return AcheteurObligéMenuLegacy({ currentPage });
    case 'ademe':
      return AdemeMenuLegacy(currentPage);
    case 'dreal':
      return DrealMenuLegacy({ currentPage, features });
    case 'admin':
    case 'dgec-validateur':
      return AdminMenuLegacy({ currentPage, features });
    case 'cre':
      return CreMenuLegacy({ currentPage });
    case 'caisse-des-dépôts':
      return CaisseDesDépôtsMenuLegacy(currentPage);
    case 'grd':
      return GrdMenuLegacy();
  }
};
