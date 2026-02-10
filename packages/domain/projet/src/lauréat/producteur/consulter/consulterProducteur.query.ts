import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';

import { ProducteurEntity } from '../index.js';
import { IdentifiantProjet } from '../../../index.js';

export type ConsulterProducteurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  producteur: string;
};

export type ConsulterProducteurQuery = Message<
  'Lauréat.Producteur.Query.ConsulterProducteur',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterProducteurReadModel>
>;

export type ConsulterProducteurDependencies = {
  find: Find;
};

export const registerConsulterProducteurQuery = ({ find }: ConsulterProducteurDependencies) => {
  const handler: MessageHandler<ConsulterProducteurQuery> = async ({ identifiantProjet }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const producteur = await find<ProducteurEntity>(
      `producteur|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(producteur).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Producteur.Query.ConsulterProducteur', handler);
};

export const mapToReadModel = ({ identifiantProjet, nom }: ProducteurEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  producteur: nom,
});
