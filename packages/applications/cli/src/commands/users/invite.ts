import { Args, Command, Flags } from '@oclif/core';
import { z } from 'zod';

import { KeycloakAdmin } from '@potentiel-libraries/keycloak-cjs';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';
import { Email } from '@potentiel-domain/common';

const configSchema = z.object({
  KEYCLOAK_SERVER: z.string().url(),
  KEYCLOAK_REALM: z.string(),
  KEYCLOAK_USER_CLIENT_ID: z.string(),
  KEYCLOAK_ADMIN_CLIENT_ID: z.string(),
  KEYCLOAK_ADMIN_CLIENT_SECRET: z.string(),
  BASE_URL: z.string().url(),
});
const ONE_MONTH = 60 * 60 * 24 * 30;

export default class InviteUser extends Command {
  static override description = 'send a user invite';
  static override examples: Command.Example[] = [];

  static override args = {
    email: Args.string({ description: 'user email', required: true }),
  };

  static override flags = {
    role: Flags.option({ options: Role.roles })({ required: true }),
    group: Flags.string({}),
  };

  public async run(): Promise<void> {
    const { flags, args } = await this.parse(InviteUser);
    const config = configSchema.parse(process.env);

    if (flags.role === 'grd' && !flags.group) {
      throw new Error('--group is required for the `grd` role');
    }

    Email.convertirEnValueType(args.email);
    Role.convertirEnValueType(flags.role);

    const keycloakAdmin = new KeycloakAdmin({
      baseUrl: config.KEYCLOAK_SERVER,
      realmName: config.KEYCLOAK_REALM,
    });
    await keycloakAdmin.auth({
      grantType: 'client_credentials',
      clientId: config.KEYCLOAK_ADMIN_CLIENT_ID,
      clientSecret: config.KEYCLOAK_ADMIN_CLIENT_SECRET,
    });

    const realmRole = await keycloakAdmin.roles.findOneByName({ name: flags.role });
    if (!realmRole || !realmRole.id) {
      throw new Error(`Cannot find realmRole ${flags.role}`);
    }

    const id = await getOrCreateUser(args.email);

    try {
      console.log(`Adding role ${flags.role}`);
      await keycloakAdmin.users.addRealmRoleMappings({
        id,
        roles: [{ id: realmRole.id, name: realmRole.name! }],
      });
      console.log(`Role ${flags.role} added`);
    } catch (e) {
      console.warn('Could not add role to user:', e);
    }

    const groupId = flags.group && (await getGroup(flags.group, flags.role));
    if (groupId) {
      try {
        console.log(`Adding group ${flags.group}`);
        await keycloakAdmin.users.addToGroup({ id, groupId });
        console.log(`Group ${flags.group} added`);
      } catch (e) {
        console.warn('Could not add group to user:', e);
      }
    }

    async function getOrCreateUser(email: string) {
      const users = await keycloakAdmin.users.find({ email });
      if (users.length > 0) {
        console.log(`User already exists`);
        return users[0].id!;
      }
      console.log(`Creating user`);
      const requiredActions = ['UPDATE_PASSWORD', 'UPDATE_PROFILE'];
      const { id } = await keycloakAdmin.users.create({
        realm: config.KEYCLOAK_REALM,
        username: args.email,
        email: args.email,
        enabled: true,
        requiredActions,
      });

      try {
        console.log(`Updating user actions`);
        await keycloakAdmin.users.executeActionsEmail({
          id,
          actions: requiredActions,
          realm: config.KEYCLOAK_REALM,
          redirectUri: config.BASE_URL + Routes.Auth.redirectToDashboard(),
          lifespan: ONE_MONTH,
          clientId: config.KEYCLOAK_USER_CLIENT_ID,
        });
      } catch (e) {
        console.log('User actions update failed', e);
        if (e instanceof Error && 'response' in e) {
          console.log(e.response);
        }
        process.exit(1);
      }

      console.log(`User ${id} created`);
      return id;
    }

    async function getGroup(group: string, role: Role.RawType) {
      if (role !== 'grd') {
        console.log(`Group format for role ${role} is unknown. Add group manually`);
        return;
      }
      const parentGroup = (await keycloakAdmin.groups.find({ search: 'GestionnairesRéseau' }))[0];
      if (!parentGroup?.id) {
        console.log("Parent group GestionnairesRéseau doesn't exist");
        process.exit(1);
      }
      const groups = await keycloakAdmin.groups.listSubGroups({ parentId: parentGroup.id });
      return groups.find((g) => g.name === group)?.id;
    }
  }
}
