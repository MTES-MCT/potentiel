import type { FC } from 'react';

import { Link } from '@/components/atoms/LinkNoPrefetch';

export type InformationDemandeComplèteRaccordementProps = {
  delaiDemandeDeRaccordementEnMois: { texte: string; valeur: number };
};

export const InformationDemandeComplèteRaccordement: FC<
  InformationDemandeComplèteRaccordementProps
> = ({ delaiDemandeDeRaccordementEnMois }) => (
  <div className="flex flex-col gap-6">
    <p>
      <span className="font-bold">* Où trouver la référence de mon dossier ?</span>
      <br />
      Vous pouvez retrouver cette donnée dans le courriel d'accusé de réception de votre demande
      complète de raccordement (
      <Link
        href="https://docs.potentiel.beta.gouv.fr/faq/ou-trouver-la-reference-du-dossier-de-raccordement-de-mon-projet"
        target="_blank"
      >
        voir un exemple d'accusé de réception
      </Link>
      )
    </p>
    <p>
      <span className="font-bold">** Quel document transmettre dans Potentiel ?</span>
      <br />
      Votre gestionnaire de réseau vous retourne un{' '}
      <span className="italic">accusé de réception</span> lorsque votre demande de raccordement est
      jugée complète.
      <br />
      Cet accusé de réception transmis sur Potentiel facilitera vos démarches administratives avec
      les différents acteurs connectés à Potentiel, il est nécessaire dans le cadre de l’instruction
      selon les cahiers des charges modificatifs et publiés le 30/08/2022.
      <br />
      Si votre gestionnaire de réseau ne vous retourne pas d'accusé de réception, veuillez
      transmettre toute autre preuve de la bonne réception de votre demande complète de
      raccordement.
    </p>
    <p>
      <span className="font-bold">Quand déposer une demande complète de raccordement ?</span>
      <br />
      Vous devez déposer une demande de raccordement dans les{' '}
      {delaiDemandeDeRaccordementEnMois.texte} mois suivant la date de désignation du projet auprès
      de votre gestionnaire de réseau.
    </p>
  </div>
);
