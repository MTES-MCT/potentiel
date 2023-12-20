import React from 'react';
import { ExternalLink } from './UI';

export const InfoLienGuideUtilisationCDC = ({
  cahiersDesChargesUrl,
}: {
  cahiersDesChargesUrl?: string;
}) => (
  <>
    <span>
      Pour plus d'informations sur les modalités d'instruction veuillez consulter cette&nbsp;
      <ExternalLink href="https://docs.potentiel.beta.gouv.fr/guide-dutilisation/gestion-de-mon-projet-sur-potentiel/cahiers-des-charges-modificatifs">
        page d'aide
      </ExternalLink>
      .
    </span>
    {cahiersDesChargesUrl && (
      <>
        <br />
        <span className="block mt-3">
          Pour consulter les détails des cahiers des charges disponibles pour votre appel d'offres,
          veuillez consulter&nbsp;
          <ExternalLink href={cahiersDesChargesUrl}>cette page de la CRE</ExternalLink>.
        </span>
      </>
    )}
  </>
);
