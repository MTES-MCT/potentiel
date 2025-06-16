import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/document';
import { Routes } from '@potentiel-applications/routes';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToGarantiesFinancièresModifiéesTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const {
      identifiantProjet,
      dateConstitution,
      attestation: { format },
      type,
      dateÉchéance,
      modifiéLe,
      modifiéPar,
    } = modification.payload as Lauréat.GarantiesFinancières.GarantiesFinancièresModifiéesEvent['payload'];

    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      GarantiesFinancières.TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
      modifiéLe,
      format,
    ).formatter();

    return {
      date: modifiéLe,
      icon,
      title: (
        <div>
          Garanties financières modifiées par <span className="font-semibold">{modifiéPar}</span>
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
