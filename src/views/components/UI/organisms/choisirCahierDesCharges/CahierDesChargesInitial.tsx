import React from 'react';
import { ExternalLink } from '../../..';
import { ProjectAppelOffre } from '../../../../../entities/appelOffre';

type CahierDesChargesInitialProps = {
  appelOffre: ProjectAppelOffre;
};

export const CahierDesChargesInitial: React.FC<CahierDesChargesInitialProps> = ({ appelOffre }) => {
  return (
    <div className="flex-column">
      <div>
        <span className="font-bold">
          Instruction selon les dispositions du cahier des charges en vigueur au moment de la
          candidature &nbsp;
        </span>
        {appelOffre.periode.cahierDesCharges.url && (
          <>
            {'('}
            <ExternalLink href={appelOffre.periode.cahierDesCharges.url}>
              voir le cahier des charges
            </ExternalLink>
            {')'}
          </>
        )}
        .
      </div>

      {appelOffre.choisirNouveauCahierDesCharges && (
        <ul className="mt-2 list-none md:list-disc p-1 md:pl-10">
          <li>Je dois envoyer ma demande ou mon signalement au format papier.</li>
          <li>
            Je pourrai changer de mode d'instruction lors de ma prochaine demande si je le souhaite.
          </li>
        </ul>
      )}
    </div>
  );
};
