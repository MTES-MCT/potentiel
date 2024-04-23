import { CahierDesChargesRéférenceParsed, ProjectAppelOffre } from '../../../../../entities';
import { Technologie } from '@potentiel-domain/appel-offre';
import { getRatiosChangementPuissance } from './getRatiosChangementPuissance';

export type GetAutoritéCompétenteInstructionPuissance = (arg: {
  project: {
    puissanceInitiale: number;
    appelOffre?: ProjectAppelOffre;
    technologie: Technologie;
    cahierDesCharges: CahierDesChargesRéférenceParsed;
  };
  nouvellePuissance: number;
}) => 'dgec' | 'dreal';

export const getAutoritéCompétenteInstructionPuissance: GetAutoritéCompétenteInstructionPuissance =
  ({ project, nouvellePuissance }) => {
    const { puissanceInitiale } = project;
    const { max } = getRatiosChangementPuissance(project);

    const ratio = (nouvellePuissance * 1000000) / (puissanceInitiale * 1000000);

    return ratio > max ? 'dgec' : 'dreal';
  };
