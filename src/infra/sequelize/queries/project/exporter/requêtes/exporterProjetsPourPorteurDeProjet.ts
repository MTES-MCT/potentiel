import { FiltreListeProjets } from '@modules/project/queries/listerProjets'
import { UserRole } from '@modules/users'
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
  localisationProjet,
  modificationsAvantImport,
  potentielSolaire,
  prix,
  résultatInstructionSensible,
  évaluationCarbone,
} from '../colonnesParCatégorie'
import { récupérerExportProjets } from './récupérerExportProjets'

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
  ...résultatInstructionSensible,
  ...modificationsAvantImport,
  ...garantiesFinancières,
]

export const exporterProjetsPourPorteurDeProjet = ({
  user,
  filtres,
}: {
  user: { id: string; role: UserRole }
  filtres?: FiltreListeProjets
}) =>
  récupérerExportProjets({
    colonnesÀExporter,
    filtres,
    seulementLesProjetsAvecAccèsPour: user.id,
  })
