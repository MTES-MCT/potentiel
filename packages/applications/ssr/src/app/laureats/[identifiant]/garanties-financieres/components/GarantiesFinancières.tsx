import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { CallOut } from '@/components/atoms/CallOut';
import { Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { StatutGarantiesFinancièresBadge } from '../StatutGarantiesFinancièresBadge';
import { DépôtGarantiesFinancièresActions } from '../(dépôt)/DépôtGarantiesFinancièresActions';
import { DépôtGarantiesFinancières } from '../(dépôt)/dépôtGarantiesFinancières.type';
import { GarantiesFinancièresActuellesActions } from '../(actuelles)/GarantiesFinancièresActuellesActions';
import { GarantiesFinancièresActuelles } from '../(actuelles)/garantiesFinancièresActuelles.type';

export type GarantiesFinancièresProps = {
  identifiantProjet: string;
  contactPorteurs?: string[];
  garantiesFinancières: DépôtGarantiesFinancières | GarantiesFinancièresActuelles;
};

export const GarantiesFinancières: FC<GarantiesFinancièresProps> = ({
  identifiantProjet,
  contactPorteurs,
  garantiesFinancières,
}) => (
  <CallOut
    className="flex-1"
    colorVariant={'info'}
    content={
      <>
        <div className="flex flex-col h-full">
          <div>
            <div className="flex gap-2">
              <Heading2>
                Garanties financières {garantiesFinancières.isActuelle ? 'actuelles' : 'à traiter'}
              </Heading2>
              {garantiesFinancières.isActuelle ? (
                <StatutGarantiesFinancièresBadge statut={garantiesFinancières.statut} />
              ) : null}
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
              {garantiesFinancières.type && (
                <div>
                  Type : <span className="font-semibold">{garantiesFinancières.type}</span>
                </div>
              )}
              {!garantiesFinancières.type && (
                <span className="font-semibold italic">
                  {garantiesFinancières.actions.includes('modifier')
                    ? 'Type de garanties financières manquant'
                    : `Type à compléter par l'autorité instructrice compétente`}
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
                <FormattedDate className="font-semibold" date={garantiesFinancières.dateÉchéance} />
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
            {garantiesFinancières.isActuelle && (
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
            )}
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
          {garantiesFinancières.isActuelle ? (
            <GarantiesFinancièresActuellesActions
              identifiantProjet={identifiantProjet}
              contactPorteurs={contactPorteurs}
              actions={garantiesFinancières.actions}
            />
          ) : (
            <DépôtGarantiesFinancièresActions
              identifiantProjet={identifiantProjet}
              actions={garantiesFinancières.actions}
            />
          )}
        </div>
      </>
    }
  />
);
