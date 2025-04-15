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
  const showPuissanceV2 = !!process.env.SHOW_PUISSANCE;
  switch (user.role) {
    case 'porteur-projet':
      return PorteurMenuLegacy({ currentPage, showPuissanceV2 });
    case 'acheteur-obligé':
      return AcheteurObligéMenuLegacy({ currentPage, showPuissanceV2 });
    case 'ademe':
      return AdemeMenuLegacy(currentPage);
    case 'dreal':
      return DrealMenuLegacy({ currentPage, showPuissanceV2 });
    case 'admin':
    case 'dgec-validateur':
      return AdminMenuLegacy({ currentPage, showPuissanceV2 });
    case 'cre':
      return CreMenuLegacy({ currentPage, showPuissanceV2 });
    case 'caisse-des-dépôts':
      return CaisseDesDépôtsMenuLegacy(currentPage);
    case 'grd':
      return GrdMenuLegacy();
  }
};
