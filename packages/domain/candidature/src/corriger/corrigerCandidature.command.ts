import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';

import { loadCandidatureFactory } from '../candidature.aggregate';
import { ImporterCandidatureCommandCommonOptions } from '../importer/importerCandidature.command';

type CorrigerCandidatureCommandOptions = ImporterCandidatureCommandCommonOptions & {
  corrigéLe: DateTime.ValueType;
  corrigéPar: Email.ValueType;
  doitRégénérerAttestation?: true;
};

export type CorrigerCandidatureCommand = Message<
  'Candidature.Command.CorrigerCandidature',
  CorrigerCandidatureCommandOptions
>;

export const registerCorrigerCandidatureCommand = (loadAggregate: LoadAggregate) => {
  const load = loadCandidatureFactory(loadAggregate);
  const handler: MessageHandler<CorrigerCandidatureCommand> = async (payload) => {
    const candidature = await load(payload.identifiantProjet);

    // NB: on devrait charger l'aggregate appel d'offre au lieu de faire une query,
    // mais cela est impossible en l'absence d'évènements.
    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: payload.identifiantProjet.appelOffre,
      },
    });

    await candidature.corriger(payload, appelOffre);
  };

  mediator.register('Candidature.Command.CorrigerCandidature', handler);
};
