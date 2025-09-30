import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../..';
import { InstallationAvecDispositifDeStockageEntity } from '../installationAvecDispositifDeStockage.entity';
import { DispositifDeStockage } from '..';

export type ConsulterInstallationAvecDispositifDeStockageReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  // installationAvecDispositifDeStockage: boolean;
  dispositifDeStockage: DispositifDeStockage.ValueType;
};

export type ConsulterInstallationAvecDispositifDeStockageQuery = Message<
  'Lauréat.InstallationAvecDispositifDeStockage.Query.ConsulterInstallationAvecDispositifDeStockage',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterInstallationAvecDispositifDeStockageReadModel>
>;

export type ConsulterInstallationAvecDispositifDeStockageDependencies = {
  find: Find;
};

export const registerConsulterInstallationAvecDispositifDeStockageQuery = ({
  find,
}: ConsulterInstallationAvecDispositifDeStockageDependencies) => {
  const handler: MessageHandler<ConsulterInstallationAvecDispositifDeStockageQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const installationAvecDispositifDeStockage =
      await find<InstallationAvecDispositifDeStockageEntity>(
        `installation-avec-dispositif-de-stockage|${identifiantProjetValueType.formatter()}`,
      );

    return Option.match(installationAvecDispositifDeStockage).some(mapToReadModel).none();
  };
  mediator.register(
    'Lauréat.InstallationAvecDispositifDeStockage.Query.ConsulterInstallationAvecDispositifDeStockage',
    handler,
  );
};

export const mapToReadModel = ({
  identifiantProjet,
  // installationAvecDispositifDeStockage,
  dispositifDeStockage,
}: InstallationAvecDispositifDeStockageEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  dispositifDeStockage: DispositifDeStockage.bind(dispositifDeStockage),
  // installationAvecDispositifDeStockage,
});
