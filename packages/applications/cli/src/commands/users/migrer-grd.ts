import { Command } from '@oclif/core';
import { mediator } from 'mediateur';

import {
  InviterUtilisateurUseCase,
  registerUtilisateurUseCases,
  Role,
} from '@potentiel-domain/utilisateur';
import { DateTime, Email } from '@potentiel-domain/common';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { getKeycloakAdminClient } from '@potentiel-libraries/keycloak-cjs';
import { killPool } from '@potentiel-libraries/pg-helpers';

export default class Migrer extends Command {
  static override description = 'migration utilisateur';
  static override examples: Command.Example[] = [];

  static override args = {};

  static override flags = {};

  protected async init() {
    registerUtilisateurUseCases({ loadAggregate });
  }

  protected async finally(_: Error | undefined) {
    await killPool();
  }

  public async run() {
    const keycloakAdmin = await getKeycloakAdminClient({
      clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET!,
      realmName: process.env.KEYCLOAK_REALM!,
      serverUrl: process.env.KEYCLOAK_SERVER!,
    });

    const parentGroups = await keycloakAdmin.groups.find({
      search: 'GestionnairesRéseau',
    });

    if (!parentGroups[0]?.id) {
      console.warn('Parent group GestionnairesRéseau not found');
      process.exit(1);
    }
    const groups = await keycloakAdmin.groups.listSubGroups({
      parentId: parentGroups[0].id,
      max: 500,
    });

    for (const group of groups) {
      const members = await keycloakAdmin.groups.listMembers({ id: group.id! });

      for (const user of members) {
        if (user.email?.endsWith('@clients')) continue;
        console.log({ email: user.email, grd: group.name });
        await mediator.send<InviterUtilisateurUseCase>({
          type: 'Utilisateur.UseCase.InviterUtilisateur',
          data: {
            identifiantUtilisateurValue: user.email!,
            rôleValue: Role.grd.nom,
            identifiantGestionnaireRéseauValue: group.name!,
            invitéLeValue: DateTime.now().formatter(),
            invitéParValue: Email.system().formatter(),
          },
        });
      }
    }
  }
}
