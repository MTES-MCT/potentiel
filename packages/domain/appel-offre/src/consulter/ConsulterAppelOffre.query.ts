import { Message, MessageHandler, mediator } from 'mediateur';
import { Find } from '@potentiel-libraries/projection';
import { AppelOffreProjection } from '../appelOffre.projection';
import { isNone } from '@potentiel/monads';
import { AppelOffreNonTrouvéErreur } from '../appelOffreNonTrouvé.error';

export type ConsulterAppelOffreReadModel = {
  id: string;
  shortTitle: string;
  title: string;
  unitePuissance: string;
  choisirNouveauCahierDesCharges?: true;
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon?: {
      référenceParagraphe: string;
      dispositions: string;
    };
  };
  periodes: Array<{
    id: string;
    title: string;
  }>;
} & DelaiRealisation;

const technologies = ['pv', 'eolien', 'hydraulique', 'N/A'] as const;
export type Technologie = (typeof technologies)[number];

type DelaiRealisation =
  | {
      delaiRealisationEnMois: number;
      decoupageParTechnologie: false;
    }
  | {
      delaiRealisationEnMoisParTechnologie: { [key in Exclude<Technologie, 'N/A'>]: number };
      decoupageParTechnologie: true;
    };

export type ConsulterAppelOffreQuery = Message<
  'CONSULTER_APPEL_OFFRE_QUERY',
  {
    identifiantAppelOffre: string;
  },
  ConsulterAppelOffreReadModel
>;

export type ConsulterAppelOffreDependencies = {
  find: Find;
};

export const registerConsulterAppelOffreQuery = ({ find }: ConsulterAppelOffreDependencies) => {
  const handler: MessageHandler<ConsulterAppelOffreQuery> = async ({ identifiantAppelOffre }) => {
    const result = await find<AppelOffreProjection>(`appel-offre|${identifiantAppelOffre}`);

    if (isNone(result)) {
      throw new AppelOffreNonTrouvéErreur();
    }

    return result;
  };

  mediator.register('CONSULTER_APPEL_OFFRE_QUERY', handler);
};
