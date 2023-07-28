import { Message, MessageHandler, mediator } from 'mediateur';
import {
  AttestationConstitution,
  IdentifiantProjetValueType,
  TypeEtDateÉchéance,
} from '../projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { createProjetAggregateId, loadProjetAggregateFactory } from '../projet.aggregate';
import {
  AttestationGarantiesFinancièresEnregistréeEvent,
  TypeGarantiesFinancièresEnregistréEvent,
} from '../projet.event';
import { checkType } from './checkType';
import { checkAttestation } from './checkAttestation';
import { TéléverserFichierAttestationGarantiesFinancièresPort } from './garantiesFinancières.ports';

export type EnregistrerGarantiesFinancièresComplètesCommand = Message<
  'ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    attestationConstitution: AttestationConstitution;
    currentUserRôle: 'admin' | 'porteur-projet' | 'dgec-validateur' | 'cre' | 'caisse-des-dépôts';
  } & TypeEtDateÉchéance
>;

export type EnregistrerGarantiesFinancièresComplètesDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  téléverserFichier: TéléverserFichierAttestationGarantiesFinancièresPort;
};

export const registerEnregistrerGarantiesFinancièresComplètesCommand = ({
  publish,
  loadAggregate,
  téléverserFichier,
}: EnregistrerGarantiesFinancièresComplètesDependencies) => {
  const loadProjet = loadProjetAggregateFactory({
    loadAggregate,
  });
  const handler: MessageHandler<EnregistrerGarantiesFinancièresComplètesCommand> = async ({
    identifiantProjet,
    typeGarantiesFinancières,
    dateÉchéance,
    attestationConstitution,
    currentUserRôle,
  }) => {
    const agrégatProjet = await loadProjet(identifiantProjet);

    checkType(typeGarantiesFinancières, dateÉchéance, currentUserRôle, agrégatProjet);
    checkAttestation(attestationConstitution);

    await téléverserFichier({
      attestationConstitution,
      identifiantProjet: identifiantProjet.formatter(),
      type: 'attestation-constitution-garanties-Financieres',
    });

    const eventForType: TypeGarantiesFinancièresEnregistréEvent = {
      type: 'TypeGarantiesFinancièresEnregistré',
      payload: {
        typeGarantiesFinancières,
        ...(dateÉchéance && {
          dateÉchéance: dateÉchéance.formatter(),
        }),
        identifiantProjet: identifiantProjet.formatter(),
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), eventForType);

    const eventForAttestation: AttestationGarantiesFinancièresEnregistréeEvent = {
      type: 'AttestationGarantiesFinancièresEnregistrée',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        format: attestationConstitution.format,
        date: attestationConstitution.date.formatter(),
      },
    };

    setTimeout(
      async () => await publish(createProjetAggregateId(identifiantProjet), eventForAttestation),
      100,
    );
  };

  mediator.register('ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES', handler);
};
