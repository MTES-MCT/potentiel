import { Command } from '@oclif/core';
import { mediator } from 'mediateur';

import {
  InviterPorteurUseCase,
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
        where u.role in (
            'admin',  'dreal',  'acheteur-obligé',  'ademe',  
            'dgec-validateur',  'caisse-des-dépôts',  'cre')
            and u.disabled is not true;
    `);

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

    const porteurs = await executeSelect<{
      email: string;
      role: Role.RawType;
      identifiantProjet: string;
    }>(`
        select 
          u.email, 
          format('%s#%s#%s#%s', p."appelOffreId",p."periodeId",p."familleId",p."numeroCRE") as "identifiantProjet"
        from users u
        inner join "UserProjects" up on u.id=up."userId"
        inner join projects p on p.id=up."projectId"
        where u.role='porteur-projet' and u.disabled is not true;
    `);

    for (const porteur of porteurs) {
      console.log({ porteur });

      await mediator.send<InviterPorteurUseCase>({
        type: 'Utilisateur.UseCase.InviterPorteur',
        data: {
          identifiantUtilisateurValue: porteur.email,
          identifiantProjetValue: porteur.identifiantProjet,
          invitéLeValue: DateTime.now().formatter(), // TODO
          invitéParValue: Email.system().formatter(), // TODO
        },
      });
    }
  }
}
