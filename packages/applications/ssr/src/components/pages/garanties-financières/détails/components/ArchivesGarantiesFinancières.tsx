import { Routes } from '@potentiel-applications/routes';

import { Heading3, Heading4 } from '@/components/atoms/headings';
import { GarantiesFinancièresArchivées } from '@/components/organisms/garantiesFinancières/types';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';
import { Timeline, TimelineProps } from '@/components/organisms/Timeline';
import { StatutGarantiesFinancièresBadge } from '@/components/molecules/garantiesFinancières/StatutGarantiesFinancièresBadge';
import { FormattedDate } from '@/components/atoms/FormattedDate';

type Props = {
  archives: Array<GarantiesFinancièresArchivées>;
};

export const ArchivesGarantiesFinancières = ({ archives }: Props) => {
  const items: TimelineProps['items'] = archives.map((garantiesFinancières) => ({
    status: 'info',
    date: garantiesFinancières.dernièreMiseÀJour.date,
    title: (
      <div className="flex gap-2">
        <Heading4>Garanties financières</Heading4>
        <StatutGarantiesFinancièresBadge statut={garantiesFinancières.statut} />
      </div>
    ),
    content: (
      <div>
        <div className="mt-5 mb-5 gap-2 text-base flex flex-col">
          {garantiesFinancières.type ? (
            <div>
              Type : <span className="font-semibold">{garantiesFinancières.type}</span>
            </div>
          ) : (
            <span className="font-semibold italic">Type de garanties financières manquant</span>
          )}
          {!garantiesFinancières.attestation && (
            <span className="font-semibold italic">
              Attestation de constitution des garanties financières manquante
            </span>
          )}
        </div>
        {garantiesFinancières.dateÉchéance && (
          <div>
            Date d'échéance :{' '}
            <FormattedDate className="font-semibold" date={garantiesFinancières.dateÉchéance} />
          </div>
        )}
        {garantiesFinancières.dateConstitution && (
          <div>
            Date de constitution :{' '}
            <FormattedDate className="font-semibold" date={garantiesFinancières.dateConstitution} />
          </div>
        )}
        <>
          {garantiesFinancières.validéLe && (
            <div>
              Validé le :{' '}
              <FormattedDate className="font-semibold" date={garantiesFinancières.validéLe} />
            </div>
          )}
          {garantiesFinancières.soumisLe && (
            <div>
              Soumis le :{' '}
              <FormattedDate className="font-semibold" date={garantiesFinancières.soumisLe} />
            </div>
          )}
        </>
        <div>
          {garantiesFinancières.attestation && (
            <DownloadDocument
              format="pdf"
              label="Télécharger l'attestation de constitution"
              url={Routes.Document.télécharger(garantiesFinancières.attestation)}
            />
          )}
        </div>
      </div>
    ),
  }));

  return (
    <div className="p-3 flex-1 flex flex-col items-start">
      <Heading3>Garanties financières archivées</Heading3>
      <div className="text-xs italic">{archives.length} garanties financières archivées</div>
      <div className="mt-3">
        <Timeline items={items} />
      </div>
    </div>
  );
};
