import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToDépôtGarantiesFinancièresEnCoursModifiéTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const {
      identifiantProjet,
      type,
      dateÉchéance,
      dateConstitution,
      modifiéLe,
      modifiéPar,
      attestation: { format },
    } = modification.payload as GarantiesFinancières.DépôtGarantiesFinancièresEnCoursModifiéEvent['payload'];

    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
      modifiéLe,
      format,
    ).formatter();

    return {
      date: modifiéLe,
      icon,
      title: (
        <div>
          Nouvelles garanties financières (soumise à instruction modifiées) par{' '}
          <span className="font-semibold">{modifiéPar}</span>
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
