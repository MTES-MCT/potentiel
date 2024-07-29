import { Routes } from '@potentiel-applications/routes';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2 } from '@/components/atoms/headings';
import { StatutGarantiesFinancièresBadge } from '@/components/molecules/garantiesFinancières/StatutGarantiesFinancièresBadge';
import { GarantiesFinancièresArchivées } from '@/components/organisms/garantiesFinancières/types';
import { CallOut } from '@/components/atoms/CallOut';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';

type Props = {
  archives: Array<GarantiesFinancièresArchivées>;
};

export const ArchivesGarantiesFinancières = ({ archives }: Props) => {
  return (
    <>
      <Heading2>Historique des garanties financières</Heading2>
      <div className="flex flex-col lg:flex-row gap-4">
        {archives.map((garantiesFinancières) => (
          <CallOut
            className="flex-1"
            colorVariant="info"
            content={
              <>
                <div>
                  <div className="flex gap-2">
                    <Heading2>Garanties financières archivées</Heading2>
                    <StatutGarantiesFinancièresBadge statut={garantiesFinancières.statut} />
                  </div>
                  <div className="text-xs italic">
                    Dernière mise à jour le{' '}
                    <FormattedDate
                      className="font-semibold"
                      date={garantiesFinancières.dernièreMiseÀJour.date}
                    />
                    {garantiesFinancières.dernièreMiseÀJour.par && (
                      <>
                        {' '}
                        par{' '}
                        <span className="font-semibold">
                          {garantiesFinancières.dernièreMiseÀJour.par}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-5 mb-5 gap-2 text-base flex flex-col">
                    {garantiesFinancières.type ? (
                      <div>
                        Type : <span className="font-semibold">{garantiesFinancières.type}</span>
                      </div>
                    ) : (
                      <span className="font-semibold italic">
                        Type de garanties financières manquant
                      </span>
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
                      <FormattedDate
                        className="font-semibold"
                        date={garantiesFinancières.dateÉchéance}
                      />
                    </div>
                  )}
                  {garantiesFinancières.dateConstitution && (
                    <div>
                      Date de constitution :{' '}
                      <FormattedDate
                        className="font-semibold"
                        date={garantiesFinancières.dateConstitution}
                      />
                    </div>
                  )}
                  <>
                    {garantiesFinancières.validéLe && (
                      <div>
                        Validé le :{' '}
                        <FormattedDate
                          className="font-semibold"
                          date={garantiesFinancières.validéLe}
                        />
                      </div>
                    )}
                    {garantiesFinancières.soumisLe && (
                      <div>
                        Soumis le :{' '}
                        <FormattedDate
                          className="font-semibold"
                          date={garantiesFinancières.soumisLe}
                        />
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
              </>
            }
          />
        ))}
      </div>
    </>
  );
};
