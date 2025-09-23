import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find, Joined } from '@potentiel-domain/entity';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Fournisseur, FournisseurEntity } from '..';
import { IdentifiantProjet } from '../../..';
import { CandidatureEntity } from '../../../candidature';

export type ConsulterFournisseurReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  évaluationCarboneSimplifiée: number;
  évaluationCarboneSimplifiéeInitiale: number;
  fournisseurs: Array<Fournisseur.ValueType>;
  technologie: AppelOffre.Technologie;
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

    if (Option.isNone(fournisseur)) {
      return Option.none;
    }

    return mapToReadModel(fournisseur);
  };
  mediator.register('Lauréat.Fournisseur.Query.ConsulterFournisseur', handler);
};

type MapToReadModel = (
  founisseur: FournisseurEntity & Joined<CandidatureEntity>,
) => ConsulterFournisseurReadModel;

export const mapToReadModel: MapToReadModel = ({
  identifiantProjet,
  évaluationCarboneSimplifiée,
  fournisseurs,
  candidature: {
    evaluationCarboneSimplifiée: évaluationCarboneSimplifiéeInitiale,
    technologieCalculée,
  },
}) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  évaluationCarboneSimplifiée,
  fournisseurs: fournisseurs.map(Fournisseur.convertirEnValueType),
  technologie: technologieCalculée,
  évaluationCarboneSimplifiéeInitiale,
});
