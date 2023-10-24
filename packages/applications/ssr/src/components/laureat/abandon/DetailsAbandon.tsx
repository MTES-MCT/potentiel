import { Abandon } from '@potentiel-domain/laureat';
import { Download } from '@codegouvfr/react-dsfr/Download';

export const DetailsAbandon = ({ abandon }: { abandon: Abandon.ConsulterAbandonReadModel }) => {
  return (
    <div className="mb-5">
      <h2>Détail de la demande</h2>
      <h3 className="mb-2">Contexte</h3>
      <ul>
        <li>
          Demande déposée par <span className="font-bold">{abandon.demande.demandéPar}</span> le{' '}
          <span className="font-bold">{abandon.demande.demandéLe}</span>
        </li>
        {abandon.demande.recandidature && (
          <li>
            Le projet s'inscrit dans un <span className="font-bold">contexte de recandidature</span>
          </li>
        )}
      </ul>
      <h3 className="mb-2">Explications du porteur de projet</h3>
      <p className="m-0 italic">{abandon.demande.raison}</p>
      {abandon.demande.piéceJustificative && (
        <Download
          details=""
          label="Télécharger la pièce justificative"
          linkProps={{
            href: `/laureat/${encodeURIComponent(abandon.identifiantProjet)}/piece-justificative`,
          }}
        />
      )}
    </div>
  );
};
