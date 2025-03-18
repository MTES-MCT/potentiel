import { Command } from '@oclif/core';
import { mediator } from 'mediateur';

import {
  InviterPorteurUseCase,
  InviterUtilisateurUseCase,
  registerUtilisateurUseCases,
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
    registerUtilisateurUseCases({ loadAggregate });
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
      createdAt: string;
      identifiantsProjet?: string[];
    }>(`     
    with first_user_created as (
        select LOWER(payload->>'email') as email,
            min("occurredAt") as first_created
        from "eventStores"
        where type = 'UserCreated'
        group by LOWER(payload->>'email')
    ),
    user_projects as (
        select up."userId",
            array_agg(
                format(
                    '%s#%s#%s#%s',
                    p."appelOffreId",
                    p."periodeId",
                    p."familleId",
                    p."numeroCRE"
                )
            ) as identifiants_projet
        from "UserProjects" up
            inner join projects p on p.id = up."projectId"
        group by up."userId"
    )
    select u.email,
        u.role,
        u."fullName",
        u.fonction,
        ud.dreal,
        COALESCE(fuc.first_created, u."createdAt") as "createdAt",
        up.identifiants_projet as "identifiantsProjet"
    from users u
        left join "userDreals" ud on ud."userId" = u.id
        left join first_user_created fuc on u.email = fuc.email
        left join user_projects up on up."userId" = u.id
    where u.disabled is not true
        and u.role <> 'grd'
        and u.email like  '%@%';
    `);

    const porteurs = users.filter((user) => user.role === 'porteur-projet');
    const usersSaufPorteurs = users.filter((user) => user.role !== 'porteur-projet');

    for (const user of usersSaufPorteurs) {
      console.log({ user });
      await mediator.send<InviterUtilisateurUseCase>({
        type: 'Utilisateur.UseCase.InviterUtilisateur',
        data: {
          identifiantUtilisateurValue: user.email,
          rôleValue: user.role,
          régionValue: user.dreal,
          invitéLeValue: DateTime.convertirEnValueType(user.createdAt).formatter(),
          invitéParValue: Email.system().formatter(),
          fonctionValue: user.fonction,
          nomCompletValue: user.fullName,
        },
      });
    }

    for (const porteur of porteurs) {
      await mediator.send<InviterPorteurUseCase>({
        type: 'Utilisateur.UseCase.InviterPorteur',
        data: {
          identifiantUtilisateurValue: porteur.email,
          identifiantsProjetValues: porteur.identifiantsProjet ?? [],
          invitéLeValue: DateTime.convertirEnValueType(porteur.createdAt).formatter(),
          invitéParValue: Email.system().formatter(),
        },
      });
    }
  }
}
