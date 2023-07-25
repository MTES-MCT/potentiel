import { Message, MessageHandler, mediator } from 'mediateur';
import { EnregistrerTypeGarantiesFinancièresCommand } from './enregistrerTypeGarantiesFinancières.command';
import { ProjetCommand } from '../projet.command';
import { EnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestationGarantiesFinancières.command';

type EnregistrerGarantiesFinancièresUseCaseData =
  EnregistrerTypeGarantiesFinancièresCommand['data'] &
    EnregistrerAttestationGarantiesFinancièresCommand['data'];

export type EnregistrerGarantiesFinancièresUseCase = Message<
  'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
  EnregistrerGarantiesFinancièresUseCaseData
>;

export const registerEnregistrerGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<EnregistrerGarantiesFinancièresUseCase> = async ({
    typeGarantiesFinancières,
    attestationGarantiesFinancières,
    identifiantProjet,
  }) => {
    await mediator.send<ProjetCommand>({
      type: 'ENREGISTER_TYPE_GARANTIES_FINANCIÈRES',
      data: { typeGarantiesFinancières, identifiantProjet },
    });

    // TO DO : pb à corriger
    setTimeout(
      async () =>
        await mediator.send<ProjetCommand>({
          type: 'ENREGISTER_ATTESTATION_GARANTIES_FINANCIÈRES',
          data: { attestationGarantiesFinancières, identifiantProjet },
        }),
      100,
    );

    // TO DO : téléverser fichier
  };

  mediator.register('ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
