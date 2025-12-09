import { Message, MessageHandler, mediator } from 'mediateur';

import { List, Where } from '@potentiel-domain/entity';
import { DateTime } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';
import { DemandeAbandonEntity, StatutPreuveRecandidature } from '../..';

type AbandonsAvecRecandidatureÀRelancerReadModel = {
  résultats: Array<{
    identifiantProjet: IdentifiantProjet.ValueType;
    demandéeLe: DateTime.ValueType;
  }>;
};

export type ListerAbandonsAvecRecandidatureÀRelancerQuery = Message<
  'Lauréat.Abandon.Query.ListerAbandonsAvecRecandidatureÀRelancer',
  {},
  AbandonsAvecRecandidatureÀRelancerReadModel
>;

export type ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies = {
  list: List;
};

export const registerListerAbandonsAvecRecandidatureÀRelancerQuery = ({
  list,
}: ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies) => {
  const handler: MessageHandler<ListerAbandonsAvecRecandidatureÀRelancerQuery> = async () => {
    const result = await list<DemandeAbandonEntity>('demande-abandon', {
      where: {
        demande: {
          estUneRecandidature: Where.equal(true),
          recandidature: {
            statut: Where.equal(StatutPreuveRecandidature.enAttente.statut),
          },
        },
      },
    });

    return {
      résultats: result.items
        .map((item) => ({
          identifiantProjet: IdentifiantProjet.convertirEnValueType(item.identifiantProjet),
          demandéeLe: item.demande.recandidature?.preuve?.demandéeLe
            ? DateTime.convertirEnValueType(item.demande.recandidature?.preuve?.demandéeLe)
            : DateTime.now(), // TODO : devrait être undefined et filter aprés, mais l'inférence n'est pas bonne. A faire quand on switch sur TS 5.5
        }))
        .filter(({ demandéeLe }) => demandéeLe.nombreJoursÉcartAvec(DateTime.now()) >= 90),
    };
  };

  mediator.register('Lauréat.Abandon.Query.ListerAbandonsAvecRecandidatureÀRelancer', handler);
};
