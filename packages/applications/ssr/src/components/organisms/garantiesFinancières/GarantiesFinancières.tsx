import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { CallOut } from '@/components/atoms/CallOut';
import { Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';

import {
  HistoriqueMainlevéeRejetée,
  HistoriqueMainlevéeRejetéeProps,
} from '../../pages/garanties-financières/détails/components/HistoriqueMainlevéeRejetée';
import {
  MainlevéeEnCours,
  MainlevéeEnCoursProps,
} from '../../pages/garanties-financières/détails/components/MainlevéeEnCours';

import { GarantiesFinancièresActions } from './GarantiesFinancièresActions';

export type GarantiesFinancièresActuelles = {
  isActuelle: true;
  type: string;
  dateÉchéance?: Iso8601DateTime;
  dateConstitution?: Iso8601DateTime;
  attestation?: string;
  validéLe?: Iso8601DateTime;
  soumisLe?: Iso8601DateTime;
  dernièreMiseÀJour: {
    date: Iso8601DateTime;
    par?: string;
  };
};

type DépôtGarantiesFinancières = {
  isActuelle: false;
  type: string;
  dateÉchéance?: Iso8601DateTime;
  dateConstitution: Iso8601DateTime;
  attestation: string;
  dernièreMiseÀJour: {
    date: Iso8601DateTime;
    par?: string;
  };
};

type Actions = Array<
  | 'instruire'
  | 'supprimer'
  | 'modifier'
  | 'enregister-attestation'
  | 'demander-mainlevée-gf-pour-projet-abandonné'
  | 'demander-mainlevée-gf-pour-projet-achevé'
>;

export type GarantiesFinancièresProps = {
  garantiesFinancières: DépôtGarantiesFinancières | GarantiesFinancièresActuelles;
  identifiantProjet: string;
  actions: Actions;
  mainlevée?: MainlevéeEnCoursProps['mainlevée'];
  historiqueMainlevée?: HistoriqueMainlevéeRejetéeProps['historiqueMainlevée'];
};

export const GarantiesFinancières: FC<GarantiesFinancièresProps> = ({
  identifiantProjet,
  garantiesFinancières,
  actions,
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
            {!garantiesFinancières.attestation && actions.includes('modifier') && (
              <span className="font-semibold italic">
                Attestation de constitution des garanties financières manquante
              </span>
            )}
            {!garantiesFinancières.attestation && !actions.includes('modifier') && (
              <span className="font-semibold italic">
                Attestation de constitution des garanties financières à transmettre par l'autorité
                instructrice compétente
              </span>
            )}
            {!garantiesFinancières.type && actions.includes('modifier') && (
              <span className="font-semibold italic">Type de garanties financières manquant</span>
            )}
            {!garantiesFinancières.type && !actions.includes('modifier') && (
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
          <GarantiesFinancièresActions identifiantProjet={identifiantProjet} actions={actions} />
          {(mainlevée || (historiqueMainlevée && historiqueMainlevée.historique.length)) && (
            <CallOut
              className="flex-1"
              colorVariant={mainlevée?.statut === 'accordé' ? 'success' : 'warning'}
              content={
                <div className="flex flex-col">
                  <Heading2>Mainlevée des garanties financières</Heading2>
                  <div className="flex">
                    {mainlevée && (
                      <MainlevéeEnCours
                        identifiantProjet={identifiantProjet}
                        mainlevée={mainlevée}
                      />
                    )}
                    {historiqueMainlevée && historiqueMainlevée.historique.length && (
                      <HistoriqueMainlevéeRejetée
                        historiqueMainlevée={historiqueMainlevée}
                        identifiantProjet={identifiantProjet}
                      />
                    )}
                  </div>
                </div>
              }
            />
          )}
        </div>
      }
    />
  </>
);
