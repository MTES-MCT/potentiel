import Button from '@codegouvfr/react-dsfr/Button';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { showMainlevéeGarantiesFinancières } from '@potentiel-applications/feature-flags';

import { CallOut } from '@/components/atoms/CallOut';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2 } from '@/components/atoms/headings';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';

import { DemanderMainlevéeGarantiesFinancières } from '../../mainlevée/demander/DemanderMainlevéeGarantiesFinancières';

import { MainlevéeEnCours, MainlevéeEnCoursProps } from './MainlevéeEnCours';
import {
  HistoriqueMainlevéeRejetée,
  HistoriqueMainlevéeRejetéeProps,
} from './HistoriqueMainlevéeRejetée';

export type GarantiesFinancièresActuelles = {
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

export type GarantiesFinancièresActuellesProps = {
  identifiantProjet: string;
  actuelles: GarantiesFinancièresActuelles & {
    actions: Array<
      | 'modifier'
      | 'enregister-attestation'
      | 'demander-mainlevée-gf-pour-projet-abandonné'
      | 'demander-mainlevée-gf-pour-projet-achevé'
    >;
  };
  mainlevée?: MainlevéeEnCoursProps['mainlevée'];
  historiqueMainlevée?: HistoriqueMainlevéeRejetéeProps['historique'];
};

export const GarantiesFinancièresActuelles: FC<GarantiesFinancièresActuellesProps> = ({
  identifiantProjet,
  actuelles: {
    type,
    dateÉchéance,
    dateConstitution,
    attestation,
    actions,
    validéLe,
    soumisLe,
    dernièreMiseÀJour,
  },
  mainlevée,
  historiqueMainlevée,
}) => (
  <>
    <CallOut
      className="flex-1"
      colorVariant={actions.includes('enregister-attestation') ? 'warning' : 'success'}
      content={
        <div className="flex flex-col">
          <div>
            <Heading2>Garanties financières actuelles</Heading2>
            <div className="text-xs italic">
              Dernière mise à jour le{' '}
              <FormattedDate className="font-semibold" date={dernièreMiseÀJour.date} />
              {dernièreMiseÀJour.par && (
                <>
                  {' '}
                  par <span className="font-semibold">{dernièreMiseÀJour.par}</span>
                </>
              )}
            </div>
            <div className="mt-5 gap-2 text-base">
              <div>
                {type && (
                  <>
                    Type : <span className="font-semibold">{type}</span>
                  </>
                )}
                {!type && actions.includes('modifier') && (
                  <span className="font-semibold italic">
                    Type de garanties financières manquant
                  </span>
                )}
                {!type && !actions.includes('modifier') && (
                  <span className="font-semibold italic">
                    Type à compléter par l'autorité instructrice compétente
                  </span>
                )}
              </div>
              {dateÉchéance && (
                <div>
                  Date d'échéance : <FormattedDate className="font-semibold" date={dateÉchéance} />
                </div>
              )}
              {dateConstitution && (
                <div>
                  Date de constitution :{' '}
                  <FormattedDate className="font-semibold" date={dateConstitution} />
                </div>
              )}
              {validéLe && (
                <div>
                  Validé le : <FormattedDate className="font-semibold" date={validéLe} />
                </div>
              )}
              {soumisLe && (
                <div>
                  Soumis le : <FormattedDate className="font-semibold" date={soumisLe} />
                </div>
              )}
              <div>
                {attestation && (
                  <DownloadDocument
                    details="fichier au format pdf"
                    label="Télécharger l'attestation"
                    linkProps={{
                      href: Routes.Document.télécharger(attestation),
                      'aria-label':
                        "Télécharger l'attestation de constitution des garanties financières",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <Actions identifiantProjet={identifiantProjet} actions={actions} />
          {showMainlevéeGarantiesFinancières && mainlevée && (
            <MainlevéeEnCours identifiantProjet={identifiantProjet} mainlevée={mainlevée} />
          )}
          {showMainlevéeGarantiesFinancières &&
            historiqueMainlevée &&
            historiqueMainlevée.length && (
              <HistoriqueMainlevéeRejetée historique={historiqueMainlevée} />
            )}
        </div>
      }
    />
  </>
);

type ActionsProps = {
  identifiantProjet: GarantiesFinancièresActuellesProps['identifiantProjet'];
  actions: GarantiesFinancièresActuellesProps['actuelles']['actions'];
};
const Actions: FC<ActionsProps> = ({ identifiantProjet, actions }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {actions.includes('modifier') && (
        <Button
          linkProps={{
            href: Routes.GarantiesFinancières.actuelles.modifier(identifiantProjet),
          }}
        >
          Modifier les garanties financières actuelles
        </Button>
      )}
      {actions.includes('enregister-attestation') && (
        <>
          <p className="italic">
            Les garanties financières sont incomplètes, merci de les compléter en enregistrant
            l'attestation de constitution
          </p>

          <Button
            linkProps={{
              href: Routes.GarantiesFinancières.actuelles.enregistrerAttestation(identifiantProjet),
            }}
          >
            Enregistrer l'attestation de constitution
          </Button>
        </>
      )}
      {(actions.includes('demander-mainlevée-gf-pour-projet-abandonné') ||
        actions.includes('demander-mainlevée-gf-pour-projet-achevé')) && (
        <>
          <DemanderMainlevéeGarantiesFinancières
            identifiantProjet={identifiantProjet}
            motif={
              actions.includes('demander-mainlevée-gf-pour-projet-abandonné')
                ? 'projet-abandonné'
                : 'projet-achevé'
            }
          />
        </>
      )}
    </div>
  );
};
