import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';

import { loadGarantiesFinancièresFactory } from '../../garantiesFinancières.aggregate';
import { loadLauréatFactory } from '../../../lauréat.aggregate';

export type ImporterTypeGarantiesFinancièresCommand = Message<
  'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerImporterTypeGarantiesFinancièresCommand = (loadAggregate: LoadAggregate) => {
  const loadGarantiesFinancières = loadGarantiesFinancièresFactory(loadAggregate);
  const loadLauréat = loadLauréatFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

  const handler: MessageHandler<ImporterTypeGarantiesFinancièresCommand> = async ({
    identifiantProjet,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(identifiantProjet, false);
    const candidature = await loadCandidature(identifiantProjet, false);
    const lauréat = await loadLauréat(identifiantProjet, false);

    await garantiesFinancières.importerType({
      identifiantProjet,
      importéLe: lauréat.notifiéLe,
      type: candidature.garantiesFinancières?.type,
      dateÉchéance: candidature.garantiesFinancières?.dateEchéance,
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
    handler,
  );
};
