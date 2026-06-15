import { Notice } from '@codegouvfr/react-dsfr/Notice';

import type { AppelOffre } from '@potentiel-domain/appel-offre';

type Props = { règlesInstructionAutomatique: AppelOffre.RègleInstructionAutomatique };

export const DemandeInfosBox = ({ règlesInstructionAutomatique }: Props) => (
  <Notice
    title="Instruction"
    className="lg:w-1/2"
    description={
      <span>
        Votre demande sera instruite par le service de l'état en région de votre projet. À défaut de
        réponse, votre demande sera réputée{' '}
        {règlesInstructionAutomatique === 'accord' ? 'accordée' : 'rejetée'} conformément aux règles
        du cahier des charges en vigueur de votre projet.
      </span>
    }
    severity="info"
  />
);
