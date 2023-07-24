import { UserRole } from '@modules/users';

import { ProjectActionProps } from '../components/Actions';
import { adminActions, drealActions, porteurProjetActions } from './actions';

export type Action = {
  title: string;
  link: string;
  isDownload?: true;
  disabled?: boolean;
};

export const getProjectActionsByRole = (role: UserRole, projet: ProjectActionProps['project']) => {
  switch (role) {
    case 'admin':
    case 'dgec-validateur':
      return adminActions(projet);
    case 'dreal':
      return drealActions(projet);
    case 'porteur-projet':
      return porteurProjetActions(projet);
    case 'acheteur-obligé':
    case 'ademe':
    case 'caisse-des-dépôts':
    case 'cre':
    default:
      return [];
  }
};
