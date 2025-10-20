import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../..';
import { TypologieInstallation } from '../../../candidature';
import { DispositifDeStockage, InstallationEntity } from '..';

export type ConsulterInstallationReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  installateur: string;
  typologieInstallation: TypologieInstallation.ValueType[];
  dispositifDeStockage?: DispositifDeStockage.ValueType;
};

export type ConsulterInstallationQuery = Message<
  'Lauréat.Installation.Query.ConsulterInstallation',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterInstallationReadModel>
>;

export type ConsulterInstallationDependencies = {
  find: Find;
};

export const registerConsulterInstallationQuery = ({ find }: ConsulterInstallationDependencies) => {
  const handler: MessageHandler<ConsulterInstallationQuery> = async ({ identifiantProjet }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const installation = await find<InstallationEntity>(
      `installation|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(installation).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Installation.Query.ConsulterInstallation', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  installateur,
  typologieInstallation,
  dispositifDeStockage,
}: InstallationEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  installateur,
  typologieInstallation: typologieInstallation.map((typologie) =>
    TypologieInstallation.convertirEnValueType(typologie),
  ),
  dispositifDeStockage:
    dispositifDeStockage && DispositifDeStockage.convertirEnValueType(dispositifDeStockage),
});
