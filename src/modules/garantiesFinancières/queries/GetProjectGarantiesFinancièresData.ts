import { IdentifiantProjet } from '@potentiel/domain';
import { ProjectGarantiesFinancièresData } from '../dtos';

//TO DO : après rebase de la branche garanties-financieres, utiliser ce type pour la page projet aussi
export type GetProjectGarantiesFinancièresData = (args: {
  identifiantProjet: IdentifiantProjet;
  garantiesFinancièresSoumisesÀLaCandidature: boolean;
}) => Promise<ProjectGarantiesFinancièresData | undefined>;
