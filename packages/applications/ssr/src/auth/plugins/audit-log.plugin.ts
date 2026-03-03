import type { BetterAuthPlugin } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/plugins';
import { mediator } from 'mediateur';

import { AjouterStatistiqueUtilisationCommand } from '@potentiel-domain/statistiques-utilisation';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Role } from '@potentiel-domain/utilisateur';

import { getUtilisateurFromEmail } from '../getUtilisateurFromEmail';

export const auditLogs = () => {
  return {
    id: 'audit-logs',
    hooks: {
      after: [
        {
          matcher: (context) => !!context.context.newSession,
          handler: createAuthMiddleware(async (ctx) => {
            try {
              const user = ctx.context.newSession?.user;
              if (!user?.email) return;

              const provider =
                ctx.path === '/magic-link/verify' ? 'magic-link' : ctx.params.providerId;

              const utilisateur = await getUtilisateurFromEmail(user.email);
              const rôle = Option.isNone(utilisateur) ? Role.visiteur : utilisateur.rôle;

              await mediator.send<AjouterStatistiqueUtilisationCommand>({
                type: 'System.Statistiques.AjouterStatistiqueUtilisation',
                data: {
                  type: 'connexionUtilisateur',
                  données: {
                    utilisateur: {
                      role: rôle.nom,
                      email: user.email,
                    },
                    provider: provider ?? '',
                  },
                },
              });
            } catch (error) {
              getLogger('AuditLogs').warn('Failed to log event', { error });
            }
          }),
        },
      ],
    },
  } satisfies BetterAuthPlugin;
};
