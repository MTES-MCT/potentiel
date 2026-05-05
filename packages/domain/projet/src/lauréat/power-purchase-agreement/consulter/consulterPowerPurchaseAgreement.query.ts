import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { DateTime, Email } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';

import { PowerPurchaseAgreementEntity } from '../powerPurchaseAgreement.entity.js';
import { IdentifiantProjet } from '../../../index.js';

export type ConsulterPowerPurchaseAgreementReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  signaléLe: DateTime.ValueType;
  signaléPar: Email.ValueType;
};

export type ConsulterPowerPurchaseAgreementQuery = Message<
  'Lauréat.PowerPurchaseAgreement.Query.ConsulterPowerPurchaseAgreement',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterPowerPurchaseAgreementReadModel>
>;

export type ConsulterPowerPurchaseAgreementDependencies = {
  find: Find;
};

export const registerConsulterPowerPurchaseAgreementQuery = ({
  find,
}: ConsulterPowerPurchaseAgreementDependencies) => {
  const handler: MessageHandler<ConsulterPowerPurchaseAgreementQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const result = await find<PowerPurchaseAgreementEntity>(
      `power-purchase-agreement|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(result)) {
      return Option.none;
    }

    return Option.match(result).some(mapToReadModel).none();
  };
  mediator.register(
    'Lauréat.PowerPurchaseAgreement.Query.ConsulterPowerPurchaseAgreement',
    handler,
  );
};

const mapToReadModel = (
  result: PowerPurchaseAgreementEntity,
): ConsulterPowerPurchaseAgreementReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),
    signaléLe: DateTime.convertirEnValueType(result.signaléLe),
    signaléPar: Email.convertirEnValueType(result.signaléPar),
  };
};
