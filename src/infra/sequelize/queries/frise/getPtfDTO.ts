import { User } from '@entities'
import { PtfDTO, ProjectStatus } from '@modules/frise'
import { makeDocumentUrl } from '../../../../views/components/timeline/helpers/makeDocumentUrl'

type PtfDonnéesPourDTO =
  | {
      ptfDateDeSignature: Date
      ptfFichier: { filename: string; id: string }
    }
  | {
      ptfDateDeSignature: null
      ptfFichier: null
    }
  | null

export const getPtfDTO = ({
  ptf,
  user,
  projetStatus,
}: {
  ptf: PtfDonnéesPourDTO
  user: User
  projetStatus: ProjectStatus
}): PtfDTO | undefined => {
  if (!ptf) return
  if (projetStatus !== 'Classé') return

  const { ptfDateDeSignature, ptfFichier } = ptf

  if (ptfFichier) {
    return {
      type: 'proposition-technique-et-financiere',
      date: ptfDateDeSignature.getTime(),
      role: user.role,
      status: 'submitted',
      url: makeDocumentUrl(ptfFichier.id, ptfFichier.filename),
    }
  } else {
    return {
      type: 'proposition-technique-et-financiere',
      role: user.role,
      status: 'not-submitted',
    }
  }
}
