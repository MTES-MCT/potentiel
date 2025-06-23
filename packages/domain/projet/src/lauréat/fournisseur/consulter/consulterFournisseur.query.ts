import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find, Joined } from '@potentiel-domain/entity';

import { Fournisseur, FournisseurEntity } from '..';
import { IdentifiantProjet } from '../../..';
import { CandidatureEntity } from '../../../candidature';

export type ConsulterFournisseurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  évaluationCarboneSimplifiée: number;
  évaluationCarboneSimplifiéeInitiale: number;
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

    const fournisseur = await find<FournisseurEntity, CandidatureEntity>(
      `fournisseur|${identifiantProjetValueType.formatter()}`,
      { join: { entity: 'candidature', on: 'identifiantProjet' } },
    );

    return Option.match(fournisseur).some(mapToReadModel).none();
  };
  mediator.register('Lauréat.Fournisseur.Query.ConsulterFournisseur', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  évaluationCarboneSimplifiée,
  fournisseurs,
  candidature: { evaluationCarboneSimplifiée: évaluationCarboneSimplifiéeInitiale },
}: FournisseurEntity & Joined<CandidatureEntity>) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  évaluationCarboneSimplifiée,
  fournisseurs: fournisseurs.map(Fournisseur.convertirEnValueType),
  évaluationCarboneSimplifiéeInitiale,
});
