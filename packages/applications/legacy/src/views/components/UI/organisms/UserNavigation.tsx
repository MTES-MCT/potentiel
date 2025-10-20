import { match, P } from 'ts-pattern';
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
export const UserNavigation = ({ user: { role } }: UserNavigationProps) =>
  match(role)
    .with('porteur-projet', () => PorteurMenuLegacy)
    .with(P.union('admin', 'dgec-validateur'), () => AdminMenuLegacy)
    .with('dreal', () => DrealMenuLegacy)
    .with('acheteur-obligé', () => AcheteurObligéMenuLegacy)
    .with('cocontractant', () => AcheteurObligéMenuLegacy)
    .with('ademe', () => AdemeMenuLegacy)
    .with('cre', () => CreMenuLegacy)
    .with('caisse-des-dépôts', () => CaisseDesDépôtsMenuLegacy)
    .with('grd', () => GrdMenuLegacy)
    .exhaustive();
