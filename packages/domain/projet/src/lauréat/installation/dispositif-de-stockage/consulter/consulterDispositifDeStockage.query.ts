import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../../..';
import { InstallationEntity } from '../../installation.entity';
import { DispositifDeStockage } from '../..';

export type ConsulterDispositifDeStockageReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dispositifDeStockage: DispositifDeStockage.ValueType;
};

export type ConsulterDispositifDeStockageQuery = Message<
  'Lauréat.Installation.Query.ConsulterDispositifDeStockage',
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

    const dispositifDeStockage = await find<InstallationEntity>(
      `installation|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(dispositifDeStockage).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Installation.Query.ConsulterDispositifDeStockage', handler);
};

export const mapToReadModel = ({ identifiantProjet, dispositifDeStockage }: InstallationEntity) =>
  dispositifDeStockage
    ? {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        dispositifDeStockage: DispositifDeStockage.bind(dispositifDeStockage),
      }
    : Option.none;
