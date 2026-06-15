import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { type LeftJoin, type List, Where } from '@potentiel-domain/entity';

import { type GetScopeProjetUtilisateur, IdentifiantProjet } from '../../index.js';
import type { AbandonEntity } from '../../lauréat/abandon/abandon.entity.js';
import type { CandidatureEntity } from '../candidature.entity.js';

export type ListerProjetsEligiblesPreuveRecanditureReadModel = Array<{
  identifiantProjet: IdentifiantProjet.ValueType;
  nom: string;
  dateDésignation: DateTime.ValueType;
}>;

export type ListerProjetsEligiblesPreuveRecanditureDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

export type ListerProjetsEligiblesPreuveRecanditureQuery = Message<
  'Candidature.Query.ListerProjetsEligiblesPreuveRecandidature',
  {
    identifiantUtilisateur: string;
  },
  ListerProjetsEligiblesPreuveRecanditureReadModel
>;

export const registerProjetsEligiblesPreuveRecanditureQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerProjetsEligiblesPreuveRecanditureDependencies) => {
  const handler: MessageHandler<ListerProjetsEligiblesPreuveRecanditureQuery> = async ({
    identifiantUtilisateur,
  }) => {
    const scope = await getScopeProjetUtilisateur(
      Email.convertirEnValueType(identifiantUtilisateur),
    );
    const { items } = await list<CandidatureEntity, [LeftJoin<AbandonEntity>]>('candidature', {
      join: [
        {
          entity: 'abandon',
          on: 'identifiantProjet',
          type: 'left',
          where: { identifiantProjet: Where.equalNull() },
        },
      ],
      where: {
        identifiantProjet: Where.matchAny(scope.identifiantProjets ?? []),
        notification: {
          notifiéeLe: Where.between(['2023-12-15T00:00:00.000Z', '2025-03-31T00:00:00.000Z']),
        },
      },
    });
    return items.map(mapToReadModel);
  };

  mediator.register('Candidature.Query.ListerProjetsEligiblesPreuveRecandidature', handler);
};

const mapToReadModel = (item: CandidatureEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(item.identifiantProjet),
  nom: item.nomProjet,
  // biome-ignore lint/style/noNonNullAssertion: spécifié dans la query
  dateDésignation: DateTime.convertirEnValueType(item.notification!.notifiéeLe),
});
