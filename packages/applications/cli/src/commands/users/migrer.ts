import { Command } from '@oclif/core';
import { mediator } from 'mediateur';

import {
  InviterUtilisateurUseCase,
  registerUtiliseurUseCases,
  Role,
} from '@potentiel-domain/utilisateur';
import { DateTime, Email } from '@potentiel-domain/common';
import { executeSelect, killPool } from '@potentiel-libraries/pg-helpers';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';

export default class Migrer extends Command {
  static override description = 'migration utilisateur';
  static override examples: Command.Example[] = [];

  static override args = {};

  static override flags = {};

  protected async init() {
    registerUtiliseurUseCases({ loadAggregate });
  }

  protected async finally(_: Error | undefined) {
    await killPool();
  }

  public async run() {
    const users = await executeSelect<{
      email: string;
      role: Role.RawType;
      fullName?: string;
      fonction?: string;
      dreal?: string;
    }>(`
        select u.email,u.role,u."fullName",u.fonction,ud.dreal from users u
        left join "userDreals" ud on u.id=ud."userId"
        where role in (
            'admin',  'dreal',  'acheteur-obligé',  'ademe',  
            'dgec-validateur',  'caisse-des-dépôts',  'cre')
    `);

    // restera
    // 'porteur-projet'
    // 'grd'

    for (const user of users) {
      console.log({ user });
      await mediator.send<InviterUtilisateurUseCase>({
        type: 'Utilisateur.UseCase.InviterUtilisateur',
        data: {
          identifiantUtilisateurValue: user.email,
          rôleValue: user.role,
          région: user.dreal,
          fonction: user.fonction,
          nomComplet: user.fullName,
          invitéLeValue: DateTime.now().formatter(), // TODO
          invitéParValue: Email.system().formatter(), // TODO
        },
      });
    }
  }
}
