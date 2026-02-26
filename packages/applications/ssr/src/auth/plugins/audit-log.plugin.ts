import type { BetterAuthPlugin } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/plugins';
import { mediator } from 'mediateur';

import { AjouterStatistiqueUtilisationCommand } from '@potentiel-domain/statistiques-utilisation';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

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
              // Get user from session (for existing session) or newSession (for new logins)
              const user = ctx.context.session?.user || ctx.context.newSession?.user;
              if (!user?.email) return;

              const provider = ctx.params.providerId;

              const utilisateur = await getUtilisateurFromEmail(user.email);
              if (Option.isNone(utilisateur)) {
                return;
              }

              await mediator.send<AjouterStatistiqueUtilisationCommand>({
                type: 'System.Statistiques.AjouterStatistiqueUtilisation',
                data: {
                  type: 'connexionUtilisateur',
                  données: {
                    utilisateur: {
                      role: utilisateur.rôle.nom,
                      email: utilisateur.identifiantUtilisateur.email,
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
