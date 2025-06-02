import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { FournisseurEntity } from '..';

export type ConsulterFournisseurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  fournisseur: string;
};

export type ConsulterFournisseurQuery = Message<
  'Lauréat.Fournisseur.Query.ConsulterFournisseur',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterFournisseurReadModel>
>;

export type ConsulterFournisseurDependencies = {
  find: Find;
};

export const registerConsulterFournisseurQuery = ({ find }: ConsulterFournisseurDependencies) => {
  const handler: MessageHandler<ConsulterFournisseurQuery> = async ({ identifiantProjet }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    const fournisseur = await find<FournisseurEntity>(
      `fournisseur|${identifiantProjetValueType.formatter()}`,
    );

    return Option.match(fournisseur).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Fournisseur.Query.ConsulterFournisseur', handler);
};

export const mapToReadModel = ({ identifiantProjet, nom }: FournisseurEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  fournisseur: nom,
});
