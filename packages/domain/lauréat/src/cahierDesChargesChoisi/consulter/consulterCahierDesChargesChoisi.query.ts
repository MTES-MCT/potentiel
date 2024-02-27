import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, Option } from '@potentiel/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { AucunCahierDesChargesChoisiTrouvéError } from '../aucunCahierDesChargesChoisiTrouvéError';

export type ConsulterCahierDesChargesChoisiReadmodel = { cahierDesChargesChoisi: string };

export type ConsulterCahierDesChargesChoisiQuery = Message<
  'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
  {
    identifiantProjet: string;
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
    identifiantProjet,
  }) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);
    const cahierDesChargesChoisi = await consulterCahierDesChargesAdapter(
      identifiantProjetValueType,
    );

    if (isNone(cahierDesChargesChoisi)) {
      throw new AucunCahierDesChargesChoisiTrouvéError();
    }

    return { cahierDesChargesChoisi };
  };
  mediator.register('Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi', handler);
};
