import { Message, MessageHandler, mediator } from 'mediateur';
import { ImporterTypeGarantiesFinancièresCommand } from './importerTypeGarantiesFinancières.command';

type ImporterTypeGarantiesFinancièresUseCaseData = ImporterTypeGarantiesFinancièresCommand['data'];

export type ImporterTypeGarantiesFinancièresUseCase = Message<
  'IMPORTER_TYPE_GARANTIES_FINANCIÈRES_USE_CASE',
  ImporterTypeGarantiesFinancièresUseCaseData
>;

export const registerImporterTypeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ImporterTypeGarantiesFinancièresUseCase> = async (message) => {
    await mediator.send<ImporterTypeGarantiesFinancièresCommand>({
      type: 'IMPORTER_TYPE_GARANTIES_FINANCIÈRES',
      data: message,
    });
  };

  mediator.register('IMPORTER_TYPE_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
