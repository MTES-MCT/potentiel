import { Message, MessageHandler, mediator } from 'mediateur';
import { EnregistrerTypeGarantiesFinancièresCommand } from './enregistrerTypeGarantiesFinancières.command';
import { ProjetCommand } from '../projet.command';
import { EnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestationGarantiesFinancières.command';
import { IdentifiantProjetValueType } from '../projet.valueType';

type EnregistrerGarantiesFinancièresUseCaseData = {
  identifiantProjet: IdentifiantProjetValueType;
  currentUserRôle: 'admin' | 'porteur-projet' | 'dgec-validateur' | 'cre' | 'caisse-des-dépôts';
} & Partial<EnregistrerTypeGarantiesFinancièresCommand['data']> &
  Partial<EnregistrerAttestationGarantiesFinancièresCommand['data']>;

export type EnregistrerGarantiesFinancièresUseCase = Message<
  'ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE',
  EnregistrerGarantiesFinancièresUseCaseData
>;

export const registerEnregistrerGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<EnregistrerGarantiesFinancièresUseCase> = async ({
    typeGarantiesFinancières,
    dateÉchéance,
    attestationConstitution,
    identifiantProjet,
    currentUserRôle,
  }) => {
    if (typeGarantiesFinancières && attestationConstitution) {
      await mediator.send<ProjetCommand>({
        type: 'ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES',
        data: {
          attestationConstitution,
          identifiantProjet,
          typeGarantiesFinancières,
          currentUserRôle,
          dateÉchéance,
        },
      });
    }

    if (typeGarantiesFinancières && !attestationConstitution) {
      await mediator.send<ProjetCommand>({
        type: 'ENREGISTER_TYPE_GARANTIES_FINANCIÈRES',
        data: {
          typeGarantiesFinancières,
          identifiantProjet,
          currentUserRôle,
          dateÉchéance,
        },
      });
    }

    if (attestationConstitution && !typeGarantiesFinancières) {
      await mediator.send<ProjetCommand>({
        type: 'ENREGISTER_ATTESTATION_GARANTIES_FINANCIÈRES',
        data: { attestationConstitution, identifiantProjet },
      });
    }
  };

  mediator.register('ENREGISTRER_GARANTIES_FINANCIÈRES_USE_CASE', runner);
};
