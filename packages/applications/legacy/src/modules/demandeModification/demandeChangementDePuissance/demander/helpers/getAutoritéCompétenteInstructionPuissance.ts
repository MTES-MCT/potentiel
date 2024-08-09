import { CahierDesChargesRéférenceParsed, ProjectAppelOffre } from '../../../../../entities';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { getRatiosChangementPuissance } from './getRatiosChangementPuissance';

type AutoritéCompétenteInstructionPuissance = 'dgec' | 'dreal';

export type GetAutoritéCompétenteInstructionPuissance = (arg: {
  project: {
    puissanceInitiale: number;
    appelOffre?: ProjectAppelOffre;
    technologie: AppelOffre.Technologie;
    cahierDesCharges: CahierDesChargesRéférenceParsed;
  };
  nouvellePuissance: number;
}) => AutoritéCompétenteInstructionPuissance;

export const getAutoritéCompétenteInstructionPuissance: GetAutoritéCompétenteInstructionPuissance =
  ({ project, nouvellePuissance }) => {
    const { puissanceInitiale } = project;
    const { max: maxRatio } = getRatiosChangementPuissance(project);

    const ratio = (nouvellePuissance * 1000000) / (puissanceInitiale * 1000000);

    return ratio > maxRatio ? 'dgec' : 'dreal';
  };
