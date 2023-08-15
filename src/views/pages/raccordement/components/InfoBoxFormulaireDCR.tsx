import { ExternalLink, InfoBox } from '../../../components';
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
      <span className="font-bold">** Quel document transmettre dans Potentiel ?</span>
      <br />
      Vous devez déposer une demande de raccordement dans les{' '}
      {delaiDemandeDeRaccordementEnMois.texte} ({delaiDemandeDeRaccordementEnMois.valeur}) mois
      suivant la date de désignation du projet auprès de votre gestionnaire de réseau.
      <br />
      Votre gestionnaire de réseau vous retourne un{' '}
      <span className="italic">accusé de réception</span> lorsque votre demande de raccordement est
      jugée complète.
      <br />
      Cet accusé de réception transmis sur Potentiel facilitera vos démarches administratives avec
      les différents acteurs connectés à Potentiel (DGEC, DREAL, Cocontractant, etc.), il est
      nécessaire dans le cadre de l’instruction selon les cahiers des charges modificatifs et publié
      le 30/08/2022.
    </p>
    <p>
      <span className="font-bold">* Où trouver la référence de mon dossier ?</span>
      <br />
      Vous pouvez retrouver cette donnée sur le courriel d'accusé de réception de votre demande
      complète de raccordement (
      <ExternalLink href="https://docs.potentiel.beta.gouv.fr/faq/ou-trouver-la-reference-du-dossier-de-raccordement-de-mon-projet">
        voir un exemple d'accusé de réception
      </ExternalLink>
      )
    </p>
  </InfoBox>
);
