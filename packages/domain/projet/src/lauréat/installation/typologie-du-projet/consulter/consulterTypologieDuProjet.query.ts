import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../../..';
import { InstallationEntity } from '../../installation.entity';
import { TypologieDuProjet } from '../../../../candidature';

export type ConsulterTypologieDuProjetReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  typologieDuProjet: TypologieDuProjet.ValueType[];
};

export type ConsulterTypologieDuProjetQuery = Message<
  'Lauréat.Installation.Query.ConsulterTypologieDuProjet',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterTypologieDuProjetReadModel>
>;

export type ConsulterTypologieDuProjetDependencies = {
  find: Find;
};

export const registerConsulterTypologieDuProjetQuery = ({
  find,
}: ConsulterTypologieDuProjetDependencies) => {
  const handler: MessageHandler<ConsulterTypologieDuProjetQuery> = async ({
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const installation = await find<InstallationEntity>(
      `installation|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(installation).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Installation.Query.ConsulterTypologieDuProjet', handler);
};

export const mapToReadModel = ({ identifiantProjet, typologieDuProjet }: InstallationEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  typologieDuProjet: typologieDuProjet.map(TypologieDuProjet.convertirEnValueType),
});
