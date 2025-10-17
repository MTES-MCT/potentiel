import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../../..';
import { InstallationEntity } from '../../installation.entity';
import { TypologieInstallation } from '../../../../candidature';

export type ConsulterTypologieInstallationReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typologieInstallation: TypologieInstallation.ValueType[];
};

export type ConsulterTypologieInstallationQuery = Message<
  'Lauréat.Installation.Query.ConsulterTypologieInstallation',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterTypologieInstallationReadModel>
>;

export type ConsulterTypologieInstallationDependencies = {
  find: Find;
};

export const registerConsulterTypologieInstallationQuery = ({
  find,
}: ConsulterTypologieInstallationDependencies) => {
  const handler: MessageHandler<ConsulterTypologieInstallationQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const installation = await find<InstallationEntity>(
      `installation|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(installation).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Installation.Query.ConsulterTypologieInstallation', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  typologieInstallation,
}: InstallationEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  typologieInstallation: typologieInstallation.map(TypologieInstallation.convertirEnValueType),
});
