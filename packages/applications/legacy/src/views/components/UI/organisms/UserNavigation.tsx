import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  MenuGRD,
  MenuPorteurProjet,
  MenuAcheteurObligé,
  MenuAdeme,
  MenuDreal,
  MenuCre,
  MenuCaisseDesDépôts,
  MenuAdmin,
} from './navigation';

type UserNavigationProps = {
  user: UtilisateurReadModel;
  currentPage?: string;
};
export const UserNavigation = ({ user, currentPage }: UserNavigationProps) => {
  const showPuissanceV2 = !!process.env.SHOW_PUISSANCE;
  switch (user.role) {
    case 'porteur-projet':
      return MenuPorteurProjet({ currentPage, showPuissanceV2 });
    case 'acheteur-obligé':
      return MenuAcheteurObligé(currentPage);
    case 'ademe':
      return MenuAdeme(currentPage);
    case 'dreal':
      return MenuDreal({ currentPage, showPuissanceV2 });
    case 'admin':
    case 'dgec-validateur':
      return MenuAdmin({ currentPage, showPuissanceV2 });
    case 'cre':
      return MenuCre({ currentPage, showPuissanceV2 });
    case 'caisse-des-dépôts':
      return MenuCaisseDesDépôts(currentPage);
    case 'grd':
      return MenuGRD();
  }
};
