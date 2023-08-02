import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../projet.valueType';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { createProjetAggregateId, loadProjetAggregateFactory } from '../projet.aggregate';
import { verifyGarantiesFinancièresTypeForCommand } from './verifyGarantiesFinancièresTypeForCommand';
import { verifyGarantiesFinancièresAttestationForCommand } from './verifyGarantiesFinancièresAttestationForCommand';
import { TéléverserFichierAttestationGarantiesFinancièresPort } from './garantiesFinancières.ports';
import {
  AttestationConstitution,
  TypeEtDateÉchéance,
  estTypeAvecDateÉchéance,
} from './garantiesFinancières.valueType';
import {
  AttestationGarantiesFinancièresEnregistréeEvent,
  TypeGarantiesFinancièresEnregistréEventV1,
} from './garantiesFinancières.event';
import { Utilisateur } from '../../domain.valueType';

export type EnregistrerGarantiesFinancièresComplètesCommand = Message<
  'ENREGISTER_GARANTIES_FINANCIÈRES_COMPLÈTES',
  {
    identifiantProjet: IdentifiantProjetValueType;
    attestationConstitution: AttestationConstitution;
    utilisateur: Utilisateur;
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
    utilisateur,
  }) => {
    const agrégatProjet = await loadProjet(identifiantProjet);

    verifyGarantiesFinancièresTypeForCommand(
      typeGarantiesFinancières,
      dateÉchéance,
      utilisateur,
      agrégatProjet,
    );

    verifyGarantiesFinancièresAttestationForCommand(attestationConstitution);

    await téléverserFichier({
      attestationConstitution,
      identifiantProjet: identifiantProjet.formatter(),
      type: 'attestation-constitution-garanties-Financieres',
    });

    const eventForType: TypeGarantiesFinancièresEnregistréEventV1 = {
      type: 'TypeGarantiesFinancièresEnregistré-v1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        ...(estTypeAvecDateÉchéance(typeGarantiesFinancières)
          ? {
              dateÉchéance: dateÉchéance!.formatter(),
              typeGarantiesFinancières,
            }
          : { typeGarantiesFinancières }),
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
