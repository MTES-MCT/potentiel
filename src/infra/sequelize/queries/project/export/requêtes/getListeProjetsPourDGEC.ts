import models from '../../../../models'
import { wrapInfra } from '@core/utils'
import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { mapToFindOptions } from '../../helpers/mapToFindOptions'
import { GarantiesFinancières } from '../../../../projectionsNext/garantiesFinancières/garantiesFinancières.model'
import { mapperVersAttributs, récupérerColonnesDétails, récupérerIntitulés } from '../Colonne'
import {
  contenuLocal,
  coordonnéesCandidat,
  coordonnéesGéodésiques,
  coûtInvestissement,
  donnéesAutoconsommation,
  donnéesDeRaccordement,
  donnéesFournisseurs,
  financementCitoyen,
  garantiesFinancières,
  identificationProjet,
  implantation,
  instruction,
  localisationProjet,
  modificationsAvantImport,
  noteInnovation,
  notes,
  potentielSolaire,
  prix,
  référencesCandidature,
  résultatInstructionSensible,
  évaluationCarbone,
} from '../colonnes'

const colonnesÀExporter = [
  ...identificationProjet,
  ...coordonnéesCandidat,
  ...financementCitoyen,
  ...contenuLocal,
  ...localisationProjet,
  ...coordonnéesGéodésiques,
  ...coûtInvestissement,
  ...donnéesAutoconsommation,
  ...donnéesDeRaccordement,
  ...donnéesFournisseurs,
  ...évaluationCarbone,
  ...potentielSolaire,
  ...implantation,
  ...prix,
  ...référencesCandidature,
  ...instruction,
  ...résultatInstructionSensible,
  ...noteInnovation,
  ...notes,
  ...modificationsAvantImport,
  ...garantiesFinancières,
]

const { Project: ProjectModel } = models

export const getListeProjetsPourDGEC = ({ filtres }: { filtres?: FiltreListeProjets }) => {
  const findOptions = filtres && mapToFindOptions(filtres)

  return wrapInfra(
    ProjectModel.findAll({
      where: findOptions?.where,
      include: [
        ...(findOptions ? findOptions.include : []),
        {
          model: GarantiesFinancières,
          as: 'garantiesFinancières',
          attributes: [],
        },
      ],
      attributes: [...mapperVersAttributs(colonnesÀExporter), 'details'],
      raw: true,
    })
  ).map((projects) => ({
    colonnes: récupérerIntitulés(colonnesÀExporter),
    données: projects.map(({ details, ...project }) => ({
      ...project,
      ...(details &&
        JSON.parse(JSON.stringify(details, récupérerColonnesDétails(colonnesÀExporter)))),
    })),
  }))
}
