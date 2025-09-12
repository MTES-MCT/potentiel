import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading3, Heading4 } from '@/components/atoms/headings';
import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';
import { getGarantiesFinancièresTypeLabel } from '@/app/_helpers';

import { StatutGarantiesFinancièresBadge } from '../StatutGarantiesFinancièresBadge';

type ArchivesGarantiesFinancièresProps = {
  archives: PlainType<Lauréat.GarantiesFinancières.ListerArchivesGarantiesFinancièresReadModel>;
};

export const ArchivesGarantiesFinancières = ({ archives }: ArchivesGarantiesFinancièresProps) => {
  const items = archives.map(mapToTimelineItem);

  return (
    <div className="p-3 flex-1 flex flex-col items-start">
      <Heading3>Garanties financières archivées</Heading3>
      <div className="text-xs italic">{archives.length} garanties financières archivées</div>
      <Timeline items={items} className="mt-3" />
    </div>
  );
};
const mapToTimelineItem = ({
  garantiesFinancières,
  dernièreMiseÀJour,
  motif,
  statut,
  attestation,
  dateConstitution,
  soumisLe,
  validéLe,
}: PlainType<Lauréat.GarantiesFinancières.ArchiveGarantiesFinancièresListItemReadModel>): TimelineItemProps => {
  const gf = Lauréat.GarantiesFinancières.GarantiesFinancières.bind(garantiesFinancières);
  return {
    status: 'info',
    date: dernièreMiseÀJour.date.date,
    title: (
      <div className="flex gap-2">
        <Heading4>Garanties financières</Heading4>
        <StatutGarantiesFinancièresBadge statut={statut.statut} />
      </div>
    ),
    content: (
      <div>
        {garantiesFinancières ? (
          <div>
            Type :{' '}
            <span className="font-semibold">
              {getGarantiesFinancièresTypeLabel(garantiesFinancières.type.type)}
            </span>
          </div>
        ) : (
          <span className="font-semibold italic">Type de garanties financières manquant</span>
        )}
        {dateConstitution && (
          <div>
            Date de constitution :{' '}
            <FormattedDate className="font-semibold" date={dateConstitution.date} />
          </div>
        )}
        {gf.estAvecDateÉchéance() && (
          <div>
            Date d'échéance :{' '}
            <FormattedDate className="font-semibold" date={gf.dateÉchéance.formatter()} />
          </div>
        )}
        <>
          {validéLe && (
            <div>
              Validé le : <FormattedDate className="font-semibold" date={validéLe.date} />
            </div>
          )}
          {soumisLe && (
            <div>
              Soumis le : <FormattedDate className="font-semibold" date={soumisLe.date} />
            </div>
          )}
        </>
        <div>
          {attestation ? (
            <DownloadDocument
              format="pdf"
              label="Télécharger l'attestation de constitution"
              url={Routes.Document.télécharger(DocumentProjet.bind(attestation).formatter())}
            />
          ) : (
            <span className="font-semibold italic">
              Attestation de constitution des garanties financières manquante
            </span>
          )}
        </div>
        <div>
          Motif d'archivage :{' '}
          <span className="font-semibold first-letter:capitalize">{motif.motif}</span>
        </div>
      </div>
    ),
  };
};
