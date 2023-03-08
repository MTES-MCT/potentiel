import { EtapeGFSupprimée } from '@modules/project';
import { EventHandler } from '../../eventHandler';
import { GarantiesFinancières } from '../garantiesFinancières.model';

export const onEtapeGFSupprimée: EventHandler<EtapeGFSupprimée> = async (
  évènement,
  transaction,
) => {
  const {
    payload: { projetId },
  } = évènement;

  await GarantiesFinancières.destroy({ where: { projetId }, transaction });
};
