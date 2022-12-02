import { User } from '@entities'
import { GarantiesFinancières } from '@infra/sequelize/projectionsNext/garantiesFinancières'
import { GarantiesFinancièresDTO } from '@modules/frise'
import { userIs } from '@modules/users'
import routes from '@routes'
import { models } from '../../models'

export const getGarantiesFinancièresDTO = async ({
  projetId,
  user,
}: {
  projetId: string
  user: User
}): Promise<GarantiesFinancièresDTO | undefined> => {
  const { File, User } = models
  if (!userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal'])(user)) return

  const données = await GarantiesFinancières.findOne({ where: { projetId } })

  if (!données) {
    return
  }

  if (données.statut === 'à traiter' || données.statut === 'validé') {
    const nomFichier = await File.findOne({
      where: { id: données.fichierId },
      attributes: ['filename'],
    })
    const envoyéParRole = await User.findOne({
      where: { id: données.envoyéesPar },
      attributes: ['role'],
    })
    const retraitDépôtPossible = données.statut === 'validé' && données.validéesPar === null
    return {
      type: 'garanties-financières',
      date: données.dateConstitution!.getTime(),
      statut: données.statut,
      url:
        données.fichierId! && routes.DOWNLOAD_PROJECT_FILE(données.fichierId, nomFichier.filename),
      ...(données.dateEchéance && { dateEchéance: données.dateEchéance?.getTime() }),
      envoyéesPar: envoyéParRole.role,
      variant: user.role,
      ...(retraitDépôtPossible && { retraitDépôtPossible }),
    }
  }

  if (données.statut === 'en attente') {
    const dateLimiteDépassée =
      (données.dateLimiteEnvoi && données.dateLimiteEnvoi <= new Date()) || false
    return {
      type: 'garanties-financières',
      date: données.dateLimiteEnvoi?.getTime() || 0,
      statut: dateLimiteDépassée ? 'en retard' : 'en attente',
      variant: user.role,
    }
  }
}
