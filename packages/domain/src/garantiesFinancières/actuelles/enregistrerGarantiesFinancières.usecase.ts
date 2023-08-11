import { Message, MessageHandler, mediator } from 'mediateur';
import { EnregistrerTypeGarantiesFinancièresCommand } from './enregistrerTypeGarantiesFinancières.command';
import { EnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestationGarantiesFinancières.command';
import { IdentifiantProjetValueType, Utilisateur } from '../../domain.valueType';
import { ProjetCommand } from '../../projet/projet.command';

type EnregistrerGarantiesFinancièresUseCaseData = {
  identifiantProjet: IdentifiantProjetValueType;
  utilisateur: Utilisateur;
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
    utilisateur,
  }) => {
    if (typeGarantiesFinancières && attestationConstitution) {
      await mediator.send<ProjetCommand>({
        type: 'ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES',
        data: {
          attestationConstitution,
          identifiantProjet,
          typeGarantiesFinancières,
          utilisateur,
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
          utilisateur,
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
