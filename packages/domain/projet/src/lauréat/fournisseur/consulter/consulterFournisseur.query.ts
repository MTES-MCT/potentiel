import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { InvalidOperationError } from '@potentiel-domain/core';
import type { Find, Joined } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { type Candidature, IdentifiantProjet } from '../../..';
import type { CandidatureEntity } from '../../../candidature';
import { Fournisseur, type FournisseurEntity } from '..';

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

    const appelOffres = await find<AppelOffre.AppelOffreEntity>(
      `appel-offre|${fournisseur.candidature.appelOffre}`,
    );
    if (Option.isNone(appelOffres)) {
      return Option.none;
    }

    return mapToReadModel(fournisseur, appelOffres);
  };
  mediator.register('Lauréat.Fournisseur.Query.ConsulterFournisseur', handler);
};

type MapToReadModel = (
  founisseur: FournisseurEntity & Joined<CandidatureEntity>,
  appelOffres: AppelOffre.AppelOffreReadModel,
) => ConsulterFournisseurReadModel;

export const mapToReadModel: MapToReadModel = (
  {
    identifiantProjet,
    évaluationCarboneSimplifiée,
    fournisseurs,
    candidature: { evaluationCarboneSimplifiée: évaluationCarboneSimplifiéeInitiale, technologie },
  },
  appelOffres,
) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  évaluationCarboneSimplifiée,
  fournisseurs: fournisseurs.map(Fournisseur.convertirEnValueType),
  technologie: getTechnologie({ appelOffres, technologie }),
  évaluationCarboneSimplifiéeInitiale,
});

type GetTechnologieProps = {
  appelOffres: AppelOffre.AppelOffreReadModel;
  technologie: Candidature.TypeTechnologie.RawType;
};

const getTechnologie = ({
  appelOffres,
  technologie: technologieCandidature,
}: GetTechnologieProps) => {
  const technologie = appelOffres.technologie ?? technologieCandidature;

  if (technologie === 'N/A') {
    throw new InvalidOperationError(`Le type de technologie de ce projet est inconnu`);
  }

  return technologie;
};
