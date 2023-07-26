import { Message, MessageHandler, mediator } from 'mediateur';
import { EnregistrerTypeGarantiesFinancièresCommand } from './enregistrerTypeGarantiesFinancières.command';
import { ProjetCommand } from '../projet.command';
import { EnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestationGarantiesFinancières.command';

type EnregistrerGarantiesFinancièresUseCaseData = Partial<
  EnregistrerTypeGarantiesFinancièresCommand['data']
> &
  Partial<EnregistrerAttestationGarantiesFinancièresCommand['data']>;

export type EnregistrerGarantiesFinancièresUseCase = Message<
  'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
  EnregistrerGarantiesFinancièresUseCaseData
>;

export const registerEnregistrerGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<EnregistrerGarantiesFinancièresUseCase> = async ({
    typeGarantiesFinancières,
    attestationGarantiesFinancières,
    identifiantProjet,
    currentUserRôle,
  }) => {
    if (
      identifiantProjet &&
      typeGarantiesFinancières &&
      attestationGarantiesFinancières &&
      currentUserRôle
    ) {
      await mediator.send<ProjetCommand>({
        type: 'ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES',
        data: {
          attestationGarantiesFinancières,
          identifiantProjet,
          typeGarantiesFinancières,
          currentUserRôle,
        },
      });
    }

    if (
      typeGarantiesFinancières &&
      identifiantProjet &&
      !attestationGarantiesFinancières &&
      currentUserRôle
    ) {
      await mediator.send<ProjetCommand>({
        type: 'ENREGISTER_TYPE_GARANTIES_FINANCIÈRES',
        data: { typeGarantiesFinancières, identifiantProjet, currentUserRôle },
      });
    }

    if (attestationGarantiesFinancières && identifiantProjet && !typeGarantiesFinancières) {
      await mediator.send<ProjetCommand>({
        type: 'ENREGISTER_ATTESTATION_GARANTIES_FINANCIÈRES',
        data: { attestationGarantiesFinancières, identifiantProjet },
      });
    }

    // TO DO : téléverser fichier
  };

  mediator.register('ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
