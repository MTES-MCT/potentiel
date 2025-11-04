import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { GetProjetUtilisateurScope } from '../../../../getScopeProjetUtilisateur.port';
import { IdentifiantProjet, Lauréat } from '../../../..';
import { ChangementNomProjetEntity } from '../../changementNomProjet.entity';

type ChangementNomProjetItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  enregistréLe: DateTime.ValueType;
};

export type ListerChangementsNomProjetReadModel = {
  items: ReadonlyArray<ChangementNomProjetItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementsNomProjetQuery = Message<
  'Lauréat.Query.ListerChangementsNomProjet',
  {
    utilisateur: Email.RawType;
    appelOffre?: string;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementsNomProjetReadModel
>;

export type ListerChangementsNomProjetDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerChangementsNomProjetQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerChangementsNomProjetDependencies) => {
  const handler: MessageHandler<ListerChangementsNomProjetQuery> = async ({
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const demandes = await list<ChangementNomProjetEntity, Lauréat.LauréatEntity>(
      'changement-nom-projet',
      {
        range,
        orderBy: {
          changement: { enregistréLe: 'descending' },
        },
        join: {
          entity: 'lauréat',
          on: 'identifiantProjet',
          where: {
            appelOffre: Where.equal(appelOffre),
            nomProjet: Where.like(nomProjet),
            localité: {
              région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined,
            },
          },
        },
        where: {
          identifiantProjet:
            scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        },
      },
    );

    return {
      ...demandes,
      items: demandes.items.map(mapToReadModel),
    };
  };

  mediator.register('Lauréat.Query.ListerChangementsNomProjet', handler);
};

const mapToReadModel = (
  entity: ChangementNomProjetEntity & Joined<Lauréat.LauréatEntity>,
): ChangementNomProjetItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  nomProjet: entity.lauréat.nomProjet,
  enregistréLe: DateTime.convertirEnValueType(entity.changement.enregistréLe),
});
