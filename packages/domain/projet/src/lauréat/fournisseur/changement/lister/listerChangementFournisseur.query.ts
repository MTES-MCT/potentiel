import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { ChangementFournisseurEntity } from '../changementFournisseur.entity';
import { IdentifiantProjet, Lauréat } from '../../../..';
import { GetProjetUtilisateurScope } from '../../../../getScopeProjetUtilisateur.port';
import { TypeFournisseur } from '../..';

type ChangementFournisseurItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  enregistréLe: DateTime.ValueType;
  fournisseurs?: Array<{
    typeFournisseur: TypeFournisseur.ValueType;
    nomDuFabricant: string;
  }>;
  évaluationCarboneSimplifiée?: number;
};

export type ListerChangementFournisseurReadModel = {
  items: ReadonlyArray<ChangementFournisseurItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerChangementFournisseurQuery = Message<
  'Lauréat.Fournisseur.Query.ListerChangementFournisseur',
  {
    utilisateur: Email.RawType;
    appelOffre?: string;
    nomProjet?: string;
    range: RangeOptions;
  },
  ListerChangementFournisseurReadModel
>;

export type ListerChangementFournisseurDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerChangementFournisseurQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerChangementFournisseurDependencies) => {
  const handler: MessageHandler<ListerChangementFournisseurQuery> = async ({
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const demandes = await list<ChangementFournisseurEntity, Lauréat.LauréatEntity>(
      'changement-fournisseur',
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
            nomProjet: Where.contain(nomProjet),
            localité: {
              région: scope.type === 'region' ? Where.equal(scope.region) : undefined,
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

  mediator.register('Lauréat.Fournisseur.Query.ListerChangementFournisseur', handler);
};

const mapToReadModel = (
  entity: ChangementFournisseurEntity & Joined<Lauréat.LauréatEntity>,
): ChangementFournisseurItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  nomProjet: entity.lauréat.nomProjet,
  enregistréLe: DateTime.convertirEnValueType(entity.changement.enregistréLe),
  fournisseurs: entity.changement.fournisseurs?.map(({ nomDuFabricant, typeFournisseur }) => ({
    nomDuFabricant,
    typeFournisseur: TypeFournisseur.convertirEnValueType(typeFournisseur),
  })),
  évaluationCarboneSimplifiée: entity.changement.évaluationCarboneSimplifiée,
});
