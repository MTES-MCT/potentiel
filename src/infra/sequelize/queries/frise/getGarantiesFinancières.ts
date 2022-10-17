import { GarantiesFinancièresDTO } from '@modules/frise'
import { userIs } from '@modules/users'
import routes from '@routes'
import { User } from '@entities'
import { GarantiesFinancièresEvent } from '../../projectionsNext/projectEvents/events/GarantiesFinancièresEvent'
const computeDueStatut = ({ dateLimiteDEnvoi, now }: { dateLimiteDEnvoi: number; now: number }) =>
  dateLimiteDEnvoi < now ? 'past-due' : 'due'

export const getGarantiesFinancières = ({
  garantiesFinancièresEvent,
  isSoumisAuxGF,
  isGarantiesFinancieresDeposeesALaCandidature,
  projectStatus,
  user,
  now = Date.now(),
}: {
  garantiesFinancièresEvent?: GarantiesFinancièresEvent
  isSoumisAuxGF?: boolean
  isGarantiesFinancieresDeposeesALaCandidature: boolean
  projectStatus: string
  user: User
  now?: number
}): GarantiesFinancièresDTO | undefined => {
  if (!userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal'])(user)) return
  if (!isSoumisAuxGF || projectStatus === 'Eliminé') return

  if (!garantiesFinancièresEvent) {
    if (!isGarantiesFinancieresDeposeesALaCandidature || projectStatus === 'Abandonné') return
    return {
      type: 'garanties-financieres',
      variant: user.role,
      statut: 'submitted-with-application',
      date: 0,
    }
  }

  const { payload } = garantiesFinancièresEvent
  const { dateLimiteDEnvoi, dateConstitution } = payload

  return {
    type: 'garanties-financieres',
    statut:
      payload.statut === 'due'
        ? computeDueStatut({ dateLimiteDEnvoi: payload.dateLimiteDEnvoi, now })
        : payload.statut,
    date: payload.statut === 'due' ? dateLimiteDEnvoi : dateConstitution,
    variant: user.role,
    ...(payload.statut !== 'due' && {
      url: routes.DOWNLOAD_PROJECT_FILE(payload.fichier.id, payload.fichier.name),
    }),
    ...('dateExpiration' in payload && { dateExpiration: payload.dateExpiration }),
    ...('initiéParRole' in payload && {
      initiéParRole: payload.initiéParRole,
    }),
  } as GarantiesFinancièresDTO
}
