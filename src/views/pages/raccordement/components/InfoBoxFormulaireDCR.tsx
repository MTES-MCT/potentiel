import { ExternalLink, InfoBox } from '@views/components';
import React, { ComponentProps } from 'react';

export type InfoBoxFormulaireDCRProps = ComponentProps<'div'> & {
  delaiDemandeDeRaccordementEnMois: { texte: string; valeur: number };
};

export const InfoBoxFormulaireDCR = ({
  delaiDemandeDeRaccordementEnMois,
  ...props
}: InfoBoxFormulaireDCRProps) => (
  <InfoBox className="flex md:w-1/3 md:mx-auto" {...props}>
    <p>
      <span className="font-bold">* Où trouver la référence de mon dossier ?</span>
      <br />
      Vous pouvez retrouver cette donnée sur le courriel d'accusé de réception de votre demande
      complète de raccordement (
      <ExternalLink href="https://docs.potentiel.beta.gouv.fr/gerer-mes-projets-et-documents/comment-transmettre-ma-demande-complete-de-raccordement-dcr">
        Voir un exemple
      </ExternalLink>
      )
    </p>
    <p>
      <span className="font-bold">** Quel document transmettre ?</span>
      <br />
      Vous devez déposer une demande de raccordement dans les{' '}
      {delaiDemandeDeRaccordementEnMois.texte} ({delaiDemandeDeRaccordementEnMois.valeur}) mois
      suivant la date de désignation du projet auprès de votre gestionnaire de réseau.
      <br />
      Votre gestionnaire de réseau vous retourne un{' '}
      <span className="italic">accusé de réception</span> lorsque votre demande de raccordement est
      jugée complète.
    </p>
  </InfoBox>
);
