import { EtapeGFSupprimée } from '@modules/project';
import { GarantiesFinancières } from '../garantiesFinancières.model';
import { getGarantiesFinancièresProjector } from '../garantiesFinancières.projector';

export default getGarantiesFinancièresProjector().on(
  EtapeGFSupprimée,
  async (évènement, transaction) => {
    const {
      payload: { projetId },
    } = évènement;

    await GarantiesFinancières.destroy({ where: { projetId }, transaction });
  },
);
