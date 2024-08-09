import { CahierDesChargesRéférenceParsed, ProjectAppelOffre } from '../../../../../entities';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { getRatiosChangementPuissance } from './getRatiosChangementPuissance';

export type ExceedsRatiosChangementPuissance = (arg: {
  project: {
    puissanceInitiale: number;
    appelOffre?: ProjectAppelOffre;
    technologie: AppelOffre.Technologie;
    cahierDesCharges: CahierDesChargesRéférenceParsed;
  };
  nouvellePuissance: number;
}) => boolean;

export const exceedsRatiosChangementPuissance: ExceedsRatiosChangementPuissance = ({
  project,
  nouvellePuissance,
}) => {
  const { puissanceInitiale } = project;
  const { min, max } = getRatiosChangementPuissance(project);
  const ratio = (nouvellePuissance * 1000000) / (puissanceInitiale * 1000000);

  return !(ratio >= min && ratio <= max);
};
