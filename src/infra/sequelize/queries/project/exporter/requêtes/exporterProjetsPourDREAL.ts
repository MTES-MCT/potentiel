import models from '../../../../models'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { UserRole } from '@modules/users/UserRoles'
import {
  coordonnéesCandidat,
  coordonnéesGéodésiques,
  donnéesAutoconsommation,
  donnéesDeRaccordement,
  donnéesFournisseurs,
  financementCitoyen,
  garantiesFinancières,
  identificationProjet,
  implantation,
  localisationProjet,
  modificationsAvantImport,
  prix,
  référencesCandidature,
  résultatInstructionSensible,
  évaluationCarbone,
} from '../colonnesParCatégorie'
import { récupérerExportProjets } from './récupérerExportProjets'

const colonnesÀExporter = [
  ...identificationProjet,
  ...coordonnéesCandidat,
  ...financementCitoyen,
  ...localisationProjet,
  ...coordonnéesGéodésiques,
  ...donnéesAutoconsommation,
  ...donnéesDeRaccordement,
  ...donnéesFournisseurs,
  ...évaluationCarbone,
  ...implantation,
  ...prix,
  ...référencesCandidature,
  ...résultatInstructionSensible,
  ...modificationsAvantImport,
  ...garantiesFinancières,
]

export const exporterProjetsPourDREAL = async ({
  filtres,
  user,
}: {
  user: { id: string; role: UserRole }
  filtres?: FiltreListeProjets
}) => {
  const régionDreal = await models.UserDreal.findOne({
    where: { userId: user.id },
    attributes: ['dreal'],
  })

  return récupérerExportProjets({
    colonnesÀExporter,
    filtres,
    seulementLesProjetsParRégion: régionDreal.dreal,
  })
}
