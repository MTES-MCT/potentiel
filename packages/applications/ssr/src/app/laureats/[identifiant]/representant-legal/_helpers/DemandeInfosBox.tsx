import { Notice } from '@codegouvfr/react-dsfr/Notice';

export const DemandeInfosBox = () => (
  <Notice
    title="Instruction"
    className="lg:w-1/2"
    description={
      <span>
        Votre demande sera instruite par le service de l'état en région de votre projet. À défaut de
        réponse, votre demande sera réputée accordée ou rejetée conformément aux règles du cahier
        des charges en vigueur de votre projet.
      </span>
    }
    severity="info"
  />
);
