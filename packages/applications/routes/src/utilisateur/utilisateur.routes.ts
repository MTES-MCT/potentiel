import { withFilters } from '../_helpers/withFilters.js';
import { encodeParameter } from '../encodeParameter.js';

type ListerProps = { actif?: boolean };
export const lister = withFilters<ListerProps>(`/utilisateurs`);
export const inviter = `/utilisateurs/inviter`;
export const modifierRôle = (identifiantUtilisateur: string) =>
  `/utilisateurs/${encodeParameter(identifiantUtilisateur)}/role:modifier`;
