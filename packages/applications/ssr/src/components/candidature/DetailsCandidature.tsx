import { ConsulterCandidatureReadModel } from '@potentiel-domain/candidature';

import { Highlight } from '@codegouvfr/react-dsfr/Highlight';

export type DetailsCandidatureProps = {
  candidature: ConsulterCandidatureReadModel;
};

export const DetailsCandidature = ({ candidature }: DetailsCandidatureProps) => {
  return (
    <Highlight>
      <div>
        <a>{candidature.nom}</a>
      </div>
      <div className="italic text-xs">
        <span>{candidature.candidat.nom}</span>
        <br />
        <span>{candidature.localité.commune}</span>, <span>{candidature.localité.département}</span>
        , <span>{candidature.localité.région}</span>
      </div>
      <div>{candidature.puissance}</div>
      <p className="m-0">
        Désigné le <span>{candidature.dateDésignation}</span> pour la période{' '}
        <span>
          {candidature.appelOffre} {candidature.période} {candidature.famille}
        </span>
      </p>
    </Highlight>
  );
};
