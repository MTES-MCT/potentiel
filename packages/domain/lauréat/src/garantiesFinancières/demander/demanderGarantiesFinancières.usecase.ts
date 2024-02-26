import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DemanderGarantiesFinancièresCommand } from './demanderGarantiesFinancières.command';

export type DemanderGarantiesFinancièresUseCase = Message<
  'DEMANDER_GARANTIES_FINANCIÈRES_USECASE',
  {
    identifiantProjetValue: string;
    dateLimiteSoumissionValue: string;
    demandéLeValue: string;
  }
>;

export const registerDemanderGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<DemanderGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    dateLimiteSoumissionValue,
    demandéLeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateLimiteSoumission = DateTime.convertirEnValueType(dateLimiteSoumissionValue);
    const demandéLe = DateTime.convertirEnValueType(demandéLeValue);

    await mediator.send<DemanderGarantiesFinancièresCommand>({
      type: 'DEMANDER_GARANTIES_FINANCIÈRES_COMMAND',
      data: {
        dateLimiteSoumission,
        identifiantProjet,
        demandéLe,
      },
    });
  };
  mediator.register('DEMANDER_GARANTIES_FINANCIÈRES_USECASE', runner);
};
