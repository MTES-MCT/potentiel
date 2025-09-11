import { Routes } from '@potentiel-applications/routes';

import { Heading3, Heading4 } from '@/components/atoms/headings';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Timeline, TimelineProps } from '@/components/organisms/Timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { StatutGarantiesFinancièresBadge } from '../StatutGarantiesFinancièresBadge';

type ArchivesGarantiesFinancièresProps = {
  archives: Array<any>;
};

export const ArchivesGarantiesFinancières = ({ archives }: ArchivesGarantiesFinancièresProps) => {
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
        {garantiesFinancières.type ? (
          <div>
            Type : <span className="font-semibold">{garantiesFinancières.type}</span>
          </div>
        ) : (
          <span className="font-semibold italic">Type de garanties financières manquant</span>
        )}
        {garantiesFinancières.dateConstitution && (
          <div>
            Date de constitution :{' '}
            <FormattedDate className="font-semibold" date={garantiesFinancières.dateConstitution} />
          </div>
        )}
        {garantiesFinancières.dateÉchéance && (
          <div>
            Date d'échéance :{' '}
            <FormattedDate className="font-semibold" date={garantiesFinancières.dateÉchéance} />
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
          {garantiesFinancières.attestation ? (
            <DownloadDocument
              format="pdf"
              label="Télécharger l'attestation de constitution"
              url={Routes.Document.télécharger(garantiesFinancières.attestation)}
            />
          ) : (
            <span className="font-semibold italic">
              Attestation de constitution des garanties financières manquante
            </span>
          )}
        </div>
        <div>
          Motif d'archivage :{' '}
          <span className="font-semibold first-letter:capitalize">
            {garantiesFinancières.motif}
          </span>
        </div>
      </div>
    ),
  }));

  return (
    <div className="p-3 flex-1 flex flex-col items-start">
      <Heading3>Garanties financières archivées</Heading3>
      <div className="text-xs italic">{archives.length} garanties financières archivées</div>
      <Timeline items={items} className="mt-3" />
    </div>
  );
};
