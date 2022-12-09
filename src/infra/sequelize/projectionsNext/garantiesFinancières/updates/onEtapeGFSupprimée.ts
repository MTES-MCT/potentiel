import { EtapeGFSupprimée } from '@modules/project'
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model'

export default GarantiesFinancièresProjector.on(
  EtapeGFSupprimée,
  async (évènement, transaction) => {
    const {
      payload: { projetId },
    } = évènement

    await GarantiesFinancières.destroy({ where: { projetId }, transaction })
  }
)
