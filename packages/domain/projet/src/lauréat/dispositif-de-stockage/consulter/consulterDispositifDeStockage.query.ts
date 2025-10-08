import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../..';
import { DispositifDeStockageEntity } from '../dispositifDeStockage.entity';
import { DispositifDeStockage } from '..';

export type ConsulterDispositifDeStockageReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dispositifDeStockage: DispositifDeStockage.ValueType;
};

export type ConsulterDispositifDeStockageQuery = Message<
  'Lauréat.DispositifDeStockage.Query.ConsulterDispositifDeStockage',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterDispositifDeStockageReadModel>
>;

export type ConsulterDispositifDeStockageDependencies = {
  find: Find;
};

export const registerConsulterDispositifDeStockageQuery = ({
  find,
}: ConsulterDispositifDeStockageDependencies) => {
  const handler: MessageHandler<ConsulterDispositifDeStockageQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const dispositifDeStockage = await find<DispositifDeStockageEntity>(
      `dispositif-de-stockage|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(dispositifDeStockage).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.DispositifDeStockage.Query.ConsulterDispositifDeStockage', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  dispositifDeStockage,
}: DispositifDeStockageEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  dispositifDeStockage: DispositifDeStockage.bind(dispositifDeStockage),
});
