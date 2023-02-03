import models from '../../../../models'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
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
  userId,
}: {
  userId: string
  filtres?: FiltreListeProjets
}) => {
  const régionDreal = await models.UserDreal.findOne({
    where: { userId },
    attributes: ['dreal'],
  })

  return récupérerExportProjets({
    colonnesÀExporter,
    filtres,
    seulementLesProjetsParRégion: régionDreal.dreal,
  })
}
