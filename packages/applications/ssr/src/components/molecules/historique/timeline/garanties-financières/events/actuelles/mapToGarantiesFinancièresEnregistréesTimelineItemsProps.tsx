import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToGarantiesFinancièresEnregistréesTimelineItemsProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    identifiantProjet,
    enregistréLe,
    enregistréPar,
    type,
    dateÉchéance,
    dateConstitution,
    attestation: { format },
  } = modification.payload as Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent['payload'];

  const attestation = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
    enregistréLe,
    format,
  ).formatter();

  return {
    date: enregistréLe,
    title: (
      <div>
        Garanties financières enregistrées par{' '}
        {<span className="font-semibold">{enregistréPar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Type : <span className="font-semibold">{type}</span>
        </div>
        {dateÉchéance && (
          <div>
            Date d'échéance :{' '}
            <span className="font-semibold">{<FormattedDate date={dateÉchéance} />}</span>
          </div>
        )}
        <div>
          Date de constitution :{' '}
          <span className="font-semibold">{<FormattedDate date={dateConstitution} />}</span>
        </div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(attestation)}
        />
      </div>
    ),
  };
};
