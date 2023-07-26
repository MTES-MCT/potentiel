import { Message, MessageHandler, mediator } from 'mediateur';
import { EnregistrerTypeGarantiesFinancièresCommand } from './enregistrerTypeGarantiesFinancières.command';
import { ProjetCommand } from '../projet.command';
import { EnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestationGarantiesFinancières.command';
import { estUnTypeDeGarantiesFinancièresAccepté } from '../projet.valueType';
import { TypeGarantiesFinancièresNonAcceptéErreur } from '../projet.error';

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
  }) => {
    if (typeGarantiesFinancières && identifiantProjet) {
      if (
        typeGarantiesFinancières.type &&
        !estUnTypeDeGarantiesFinancièresAccepté(typeGarantiesFinancières.type)
      ) {
        throw new TypeGarantiesFinancièresNonAcceptéErreur();
      }

      await mediator.send<ProjetCommand>({
        type: 'ENREGISTER_TYPE_GARANTIES_FINANCIÈRES',
        data: { typeGarantiesFinancières, identifiantProjet },
      });
    }

    if (attestationGarantiesFinancières && identifiantProjet) {
      // TO DO : pb à corriger pour retirer le setTimeout
      setTimeout(
        async () =>
          await mediator.send<ProjetCommand>({
            type: 'ENREGISTER_ATTESTATION_GARANTIES_FINANCIÈRES',
            data: { attestationGarantiesFinancières, identifiantProjet },
          }),
        100,
      );
    }

    // TO DO : téléverser fichier
  };

  mediator.register('ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
