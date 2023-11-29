import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, Option } from '@potentiel/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { AucunCahierDesChargesTrouvéError } from '../aucunCahierDesChargesTrouvéError';
import { CahierDesChargesRéférence } from '..';

export type ConsulterCahierDesChargesReadmodel = CahierDesChargesRéférence.ValueType;

export type ConsulterCahierDesChargesQuery = Message<
  'CONSULTER_CAHIER_DES_CHARGES_QUERY',
  {
    identifiantProjetValue: string;
  },
  ConsulterCahierDesChargesReadmodel
>;

export type ConsulterCahierDesChargesPort = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<Option<string>>;

export type ConsulterCahierDesChargesDependencies = {
  consulterCahierDesChargesAdapter: ConsulterCahierDesChargesPort;
};

export const registerConsulterCahierDesChargesQuery = ({
  consulterCahierDesChargesAdapter,
}: ConsulterCahierDesChargesDependencies) => {
  const handler: MessageHandler<ConsulterCahierDesChargesQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const cahierDesCharges = await consulterCahierDesChargesAdapter(identifiantProjet);

    if (isNone(cahierDesCharges)) {
      throw new AucunCahierDesChargesTrouvéError();
    }

    return CahierDesChargesRéférence.convertirEnValueType(cahierDesCharges);
  };
  mediator.register('CONSULTER_CAHIER_DES_CHARGES_QUERY', handler);
};
