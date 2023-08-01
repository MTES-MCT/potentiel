import { Message, MessageHandler, mediator } from 'mediateur';
import { EnregistrerTypeGarantiesFinancièresCommand } from './enregistrerTypeGarantiesFinancières.command';
import { ProjetCommand } from '../projet.command';
import { EnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestationGarantiesFinancières.command';
import { IdentifiantProjetValueType } from '../projet.valueType';
import { Utilisateur } from '../../domain.valueType';

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
