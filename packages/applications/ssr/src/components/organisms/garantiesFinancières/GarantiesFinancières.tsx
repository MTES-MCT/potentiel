import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { CallOut } from '@/components/atoms/CallOut';
import { Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';

import { HistoriqueMainlevéeRejetéeProps } from '../../pages/garanties-financières/détails/components/HistoriqueMainlevéeRejetée';
import { MainlevéeEnCoursProps } from '../../pages/garanties-financières/détails/components/MainlevéeEnCours';
import { Mainlevée } from '../../pages/garanties-financières/détails/components/Mainlevée';

import { GarantiesFinancièresActions } from './GarantiesFinancièresActions';
import { GarantiesFinancièresActuelles, DépôtGarantiesFinancières } from './types';

export type GarantiesFinancièresProps = {
  garantiesFinancières: DépôtGarantiesFinancières | GarantiesFinancièresActuelles;
  identifiantProjet: string;
  mainlevée?: MainlevéeEnCoursProps['mainlevéeEnCours'];
  historiqueMainlevée?: HistoriqueMainlevéeRejetéeProps['historiqueMainlevée'];
};

export const GarantiesFinancières: FC<GarantiesFinancièresProps> = ({
  identifiantProjet,
  garantiesFinancières,
  mainlevée,
  historiqueMainlevée,
}) => (
  <>
    <CallOut
      className="flex-1"
      colorVariant={'info'}
      content={
        <div className="flex flex-col h-full">
          <Heading2>
            Garanties financières {garantiesFinancières.isActuelle ? 'actuelles' : 'à traiter'}
          </Heading2>
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
                <span className="font-semibold">{garantiesFinancières.dernièreMiseÀJour.par}</span>
              </>
            )}
          </div>

          <div className="mt-5 gap-2 text-base">
            {garantiesFinancières.type && (
              <>
                Type : <span className="font-semibold">{garantiesFinancières.type}</span>
              </>
            )}
            {!garantiesFinancières.attestation &&
              garantiesFinancières.actions.includes('modifier') && (
                <span className="font-semibold italic">
                  Attestation de constitution des garanties financières manquante
                </span>
              )}
            {!garantiesFinancières.attestation &&
              !garantiesFinancières.actions.includes('modifier') && (
                <span className="font-semibold italic">
                  Attestation de constitution des garanties financières à transmettre par l'autorité
                  instructrice compétente
                </span>
              )}
            {!garantiesFinancières.type && garantiesFinancières.actions.includes('modifier') && (
              <span className="font-semibold italic">Type de garanties financières manquant</span>
            )}
            {!garantiesFinancières.type && !garantiesFinancières.actions.includes('modifier') && (
              <span className="font-semibold italic">
                Type à compléter par l'autorité instructrice compétente
              </span>
            )}
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
            {garantiesFinancières.isActuelle && garantiesFinancières.validéLe && (
              <div>
                Validé le :{' '}
                <FormattedDate className="font-semibold" date={garantiesFinancières.validéLe} />
              </div>
            )}
            {garantiesFinancières.isActuelle && garantiesFinancières.soumisLe && (
              <div>
                Soumis le :{' '}
                <FormattedDate className="font-semibold" date={garantiesFinancières.soumisLe} />
              </div>
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
            <GarantiesFinancièresActions
              identifiantProjet={identifiantProjet}
              actions={garantiesFinancières.actions}
              isActuelle={garantiesFinancières.isActuelle}
            />
          ) : (
            <GarantiesFinancièresActions
              identifiantProjet={identifiantProjet}
              actions={garantiesFinancières.actions}
              isActuelle={garantiesFinancières.isActuelle}
            />
          )}
          {(mainlevée || (historiqueMainlevée && historiqueMainlevée.historique.length)) && (
            <Mainlevée
              mainlevéeEnCours={mainlevée}
              historiqueMainlevée={historiqueMainlevée}
              identifiantProjet={identifiantProjet}
            />
          )}
        </div>
      }
    />
  </>
);
