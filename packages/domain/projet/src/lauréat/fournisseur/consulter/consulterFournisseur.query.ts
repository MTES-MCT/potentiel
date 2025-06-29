import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find } from '@potentiel-domain/entity';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { Fournisseur, FournisseurEntity } from '..';

export type ConsulterFournisseurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  évaluationCarboneSimplifiée: number;
  fournisseurs: Array<Fournisseur.ValueType>;
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

export const mapToReadModel = ({
  identifiantProjet,
  évaluationCarboneSimplifiée,
  fournisseurs,
}: FournisseurEntity) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  évaluationCarboneSimplifiée,
  fournisseurs: fournisseurs.map(Fournisseur.convertirEnValueType),
});
