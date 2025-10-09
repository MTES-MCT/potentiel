import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../../..';
import { InstallationEntity } from '../../installation.entity';

export type ConsulterInstallateurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  installateur: string;
};

export type ConsulterInstallateurQuery = Message<
  'Lauréat.Installation.Query.ConsulterInstallateur',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterInstallateurReadModel>
>;

export type ConsulterInstallateurDependencies = {
  find: Find;
};

export const registerConsulterInstallateurQuery = ({ find }: ConsulterInstallateurDependencies) => {
  const handler: MessageHandler<ConsulterInstallateurQuery> = async ({ identifiantProjet }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const installation = await find<InstallationEntity>(
      `installation|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(installation).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Installation.Query.ConsulterInstallateur', handler);
};

export const mapToReadModel = ({ identifiantProjet, installateur }: InstallationEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  installateur,
});
