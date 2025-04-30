import { mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { ListerPorteursQuery, RetirerAccèsProjetUseCase } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

export const retirerTousLesAccèsAuxPorteursDuProjet = async (identifiantProjet: string) => {
  try {
    const porteurs = await mediator.send<ListerPorteursQuery>({
      type: 'Utilisateur.Query.ListerPorteurs',
      data: { identifiantProjet },
    });

    for (const porteur of porteurs.items) {
      await mediator.send<RetirerAccèsProjetUseCase>({
        type: 'Utilisateur.UseCase.RetirerAccèsProjet',
        data: {
          identifiantProjet,
          identifiantUtilisateur: porteur.email,
          retiréLe: DateTime.now().formatter(),
          retiréPar: Email.system().formatter(),
          cause: 'changement-producteur',
        },
      });
    }
  } catch (error) {
    getLogger().error(
      new Error('Impossible de retirer les accès aux porteurs suite au changement de producteur', {
        cause: error,
      }),
    );
  }
};
