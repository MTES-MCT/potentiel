import { User, Project } from '../entities';
import { mediator } from 'mediateur';
import { Accès } from '@potentiel-domain/projet';
import { getIdentifiantProjetByLegacyId } from '../config';

interface CallUseCaseProps {
  projectId: Project['id'];
  user: User;
}

export default function makeShouldUserAccessProject() {
  return {
    async check({ projectId, user }: CallUseCaseProps): Promise<boolean> {
      const projet = await getIdentifiantProjetByLegacyId(projectId);
      if (!projet) {
        return false;
      }
      try {
        await mediator.send<Accès.VérifierAccèsProjetQuery>({
          type: 'System.Projet.Accès.Query.VérifierAccèsProjet',
          data: {
            identifiantProjetValue: projet.identifiantProjetValue,
            identifiantUtilisateurValue: user.email,
          },
        });
        return true;
      } catch {
        return false;
      }
    },
  };
}
