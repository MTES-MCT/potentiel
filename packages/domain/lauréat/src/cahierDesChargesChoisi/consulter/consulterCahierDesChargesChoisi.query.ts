import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, Option } from '@potentiel/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { AucunCahierDesChargesChoisiTrouvéError } from '../aucunCahierDesChargesChoisiTrouvéError';

export type ConsulterCahierDesChargesChoisiReadmodel = { cahierDesChargesChoisi: string };

export type ConsulterCahierDesChargesChoisiQuery = Message<
  'CONSULTER_CAHIER_DES_CHARGES_QUERY',
  {
    identifiantProjetValue: string;
  },
  ConsulterCahierDesChargesChoisiReadmodel
>;

export type ConsulterCahierDesChargesChoisiPort = (
  identifiantProjet: IdentifiantProjet.ValueType,
) => Promise<Option<string>>;

export type ConsulterCahierDesChargesChoisiDependencies = {
  consulterCahierDesChargesAdapter: ConsulterCahierDesChargesChoisiPort;
};

export const registerConsulterCahierDesChargesChoisiQuery = ({
  consulterCahierDesChargesAdapter,
}: ConsulterCahierDesChargesChoisiDependencies) => {
  const handler: MessageHandler<ConsulterCahierDesChargesChoisiQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const cahierDesChargesChoisi = await consulterCahierDesChargesAdapter(identifiantProjet);

    if (isNone(cahierDesChargesChoisi)) {
      throw new AucunCahierDesChargesChoisiTrouvéError();
    }

    return { cahierDesChargesChoisi };
  };
  mediator.register('CONSULTER_CAHIER_DES_CHARGES_QUERY', handler);
};
