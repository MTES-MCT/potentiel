import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../..';
import { InstallateurEntity } from '../installateur.entity';

export type ConsulterInstallateurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  installateur: string;
};

export type ConsulterInstallateurQuery = Message<
  'Lauréat.Installateur.Query.ConsulterInstallateur',
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

    const installateur = await find<InstallateurEntity>(
      `installateur|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(installateur).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Installateur.Query.ConsulterInstallateur', handler);
};

export const mapToReadModel = ({ identifiantProjet, installateur }: InstallateurEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  installateur,
});
