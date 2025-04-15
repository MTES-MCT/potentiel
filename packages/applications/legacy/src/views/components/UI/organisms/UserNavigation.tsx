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
export const UserNavigation = ({ user, currentPage }: UserNavigationProps) => {
  switch (user.role) {
    case 'porteur-projet':
      return PorteurMenuLegacy({ currentPage });
    case 'acheteur-obligé':
      return AcheteurObligéMenuLegacy({ currentPage });
    case 'ademe':
      return AdemeMenuLegacy(currentPage);
    case 'dreal':
      return DrealMenuLegacy({ currentPage });
    case 'admin':
    case 'dgec-validateur':
      return AdminMenuLegacy({ currentPage });
    case 'cre':
      return CreMenuLegacy({ currentPage });
    case 'caisse-des-dépôts':
      return CaisseDesDépôtsMenuLegacy(currentPage);
    case 'grd':
      return GrdMenuLegacy();
  }
};
