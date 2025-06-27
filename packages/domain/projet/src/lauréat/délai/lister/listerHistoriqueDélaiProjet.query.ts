import { Message, MessageHandler, mediator } from 'mediateur';

import { HistoryRecord } from '@potentiel-domain/entity';

export type ConsulterDélaiAccordéProjetPort = (
  identifiantProjet: string,
) => Promise<Array<HistoriqueDélaiProjetListItemReadModel>>;

export type HistoriqueDélaiProjetListItemReadModel = HistoryRecord<
  'délai',
  'DélaiAccordé-V1',
  {
    identifiantProjet: string;
    raison: 'covid' | 'demande' | 'cdc-18-mois';
    durée: number;
  }
>;

export type ListerHistoriqueDélaiProjetReadModel = Array<HistoriqueDélaiProjetListItemReadModel>;

export type ListerHistoriqueDélaiProjetQuery = Message<
  'Lauréat.Délai.Query.ListerHistoriqueDélaiProjet',
  {
    identifiantProjet: string;
  },
  ListerHistoriqueDélaiProjetReadModel
>;

export type ListerHistoriqueDélaiProjetDependencies = {
  consulterDélaiAccordé: ConsulterDélaiAccordéProjetPort;
};

export const registerListerHistoriqueDélaiProjetQuery = ({
  consulterDélaiAccordé,
}: ListerHistoriqueDélaiProjetDependencies) => {
  const handler: MessageHandler<ListerHistoriqueDélaiProjetQuery> = async ({
    identifiantProjet,
  }) => {
    const items = await consulterDélaiAccordé(identifiantProjet);
    return items;
  };

  mediator.register('Lauréat.Délai.Query.ListerHistoriqueDélaiProjet', handler);
};
