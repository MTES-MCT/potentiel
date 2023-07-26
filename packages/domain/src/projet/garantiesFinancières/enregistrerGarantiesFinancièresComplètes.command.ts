import { Message, MessageHandler, mediator } from 'mediateur';
import {
  AttestationGarantiesFinancières,
  IdentifiantProjetValueType,
  TypeGarantiesFinancières,
} from '../projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { createProjetAggregateId, loadProjetAggregateFactory } from '../projet.aggregate';
import {
  AttestationGarantiesFinancièresEnregistréeEvent,
  TypeGarantiesFinancièresEnregistréEvent,
} from '../projet.event';
import { checkType } from './checkType';
import { checkAttestation } from './checkAttestation';

export type EnregistrerGarantiesFinancièresComplètesCommand = Message<
  'ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    typeGarantiesFinancières: TypeGarantiesFinancières;
    attestationGarantiesFinancières: AttestationGarantiesFinancières;
    currentUserRôle: 'admin' | 'porteur-projet' | 'dgec-validateur' | 'cre' | 'caisse-des-dépôts';
  }
>;

export type EnregistrerGarantiesFinancièresComplètesDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerEnregistrerGarantiesFinancièresComplètesCommand = ({
  publish,
  loadAggregate,
}: EnregistrerGarantiesFinancièresComplètesDependencies) => {
  const loadProjet = loadProjetAggregateFactory({
    loadAggregate,
  });
  const handler: MessageHandler<EnregistrerGarantiesFinancièresComplètesCommand> = async ({
    identifiantProjet,
    typeGarantiesFinancières,
    attestationGarantiesFinancières,
    currentUserRôle,
  }) => {
    const agrégatProjet = await loadProjet(identifiantProjet);
    checkType(typeGarantiesFinancières, currentUserRôle, agrégatProjet);
    checkAttestation(attestationGarantiesFinancières);

    const eventForType: TypeGarantiesFinancièresEnregistréEvent = {
      type: 'TypeGarantiesFinancièresEnregistré',
      payload: {
        type: typeGarantiesFinancières.type,
        ...(typeGarantiesFinancières.dateÉchéance && {
          dateÉchéance: typeGarantiesFinancières.dateÉchéance.formatter(),
        }),
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), eventForType);

    const eventForAttestation: AttestationGarantiesFinancièresEnregistréeEvent = {
      type: 'AttestationGarantiesFinancièresEnregistrée',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        format: attestationGarantiesFinancières.format,
        dateConstitution: attestationGarantiesFinancières.dateConstitution.formatter(),
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), eventForAttestation);
  };

  mediator.register('ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES', handler);
};
