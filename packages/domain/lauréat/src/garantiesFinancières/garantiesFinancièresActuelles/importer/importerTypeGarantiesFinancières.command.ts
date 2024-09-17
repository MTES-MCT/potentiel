import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { InvalidOperationError, LoadAggregate } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';

export type ImporterTypeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerImporterTypeGarantiesFinancièresCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);
  const handler: MessageHandler<ImporterTypeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    const candidature = await loadCandidature(identifiantProjet);
    if (!candidature.garantiesFinancières) {
      throw new GarantiesFinancièresManquantesError(identifiantProjet.formatter());
    }

    await garantiesFinancières.importerType({
      identifiantProjet,
      importéLe: candidature.importéLe,
      type: candidature.garantiesFinancières.type,
      dateÉchéance: candidature.garantiesFinancières.dateÉchéance,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
    handler,
  );
};

class GarantiesFinancièresManquantesError extends InvalidOperationError {
  constructor(identifiantProjet: string) {
    super(`Les informations de garanties financières sont manquantes dans la candidature`, {
      identifiantProjet,
    });
  }
}
