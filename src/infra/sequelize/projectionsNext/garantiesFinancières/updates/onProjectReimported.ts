import { ProjectReimported } from '@modules/project'
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model'

export default GarantiesFinancièresProjector.on(
  ProjectReimported,
  async (évènement, transaction) => {
    const {
      payload: { projectId: projetId, data },
    } = évènement
    if (data.classe === 'Eliminé') {
      await GarantiesFinancières.destroy({ where: { projetId }, transaction })
    }
    return
  }
)
