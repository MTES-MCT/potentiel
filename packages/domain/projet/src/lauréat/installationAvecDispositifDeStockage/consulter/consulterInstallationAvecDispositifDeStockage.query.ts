import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../..';
import { InstallationAvecDispositifDeStockageEntity } from '../installationAvecDispositifDeStockage.entity';

export type ConsulterInstallationAvecDispositifDeStockageReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  installationAvecDispositifDeStockage: boolean;
};

export type ConsulterInstallationAvecDispositifDeStockageQuery = Message<
  'Lauréat.InstallationAvecDispositifDeStockage.Query.Consulter',
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
  mediator.register('Lauréat.InstallationAvecDispositifDeStockage.Query.Consulter', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  installationAvecDispositifDeStockage,
}: InstallationAvecDispositifDeStockageEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  installationAvecDispositifDeStockage,
});
