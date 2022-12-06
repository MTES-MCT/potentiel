import { User } from '@entities'
import { GarantiesFinancièresStatut } from '@infra/sequelize'
import { GarantiesFinancièresDTO } from '@modules/frise'
import { userIs } from '@modules/users'
import routes from '@routes'
import { models } from '../../models'

type GarantiesFinancièresDonnéesPourDTO = {
  statut: GarantiesFinancièresStatut
  envoyéesPar: string | null
  dateLimiteEnvoi: Date | null
  dateConstitution: Date | null
  dateEchéance: Date | null
  validéesPar: string | null
  fichier?: { filename: string; id: string }
}

export const getGarantiesFinancièresDTO = async ({
  garantiesFinancières,
  user,
}: {
  garantiesFinancières: GarantiesFinancièresDonnéesPourDTO | undefined
  user: User
}): Promise<GarantiesFinancièresDTO | undefined> => {
  if (!userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal'])(user)) return
  if (!garantiesFinancières) return

  const { User } = models
  const {
    statut,
    envoyéesPar,
    dateConstitution,
    dateEchéance,
    validéesPar,
    dateLimiteEnvoi,
    fichier,
  } = garantiesFinancières

  if (statut === 'à traiter' || statut === 'validé') {
    const envoyéParRole = await User.findOne({
      where: { id: envoyéesPar },
      attributes: ['role'],
    })

    return {
      type: 'garanties-financières',
      date: dateConstitution!.getTime(),
      statut,
      url: fichier!! && routes.DOWNLOAD_PROJECT_FILE(fichier.id, fichier.filename),
      ...(dateEchéance && { dateEchéance: dateEchéance.getTime() }),
      envoyéesPar: envoyéParRole.role,
      variant: user.role,
      ...(statut === 'validé' && validéesPar === null && { retraitDépôtPossible: true }),
    }
  }

  if (statut === 'en attente') {
    const dateLimiteDépassée = (dateLimiteEnvoi && dateLimiteEnvoi <= new Date()) || false
    return {
      type: 'garanties-financières',
      date: dateLimiteEnvoi?.getTime() || 0,
      statut: dateLimiteDépassée ? 'en retard' : 'en attente',
      variant: user.role,
    }
  }
}
