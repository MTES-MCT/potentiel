import { Role } from '@potentiel-domain/utilisateur';

// L'import de withUtilisateur pose des problèmes à l'execution de storybook
export async function withUtilisateur(action) {
  return action({ role: Role.admin });
}
