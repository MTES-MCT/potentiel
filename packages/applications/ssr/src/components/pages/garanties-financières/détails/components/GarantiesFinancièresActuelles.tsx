import Button from '@codegouvfr/react-dsfr/Button';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

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
  <div className="flex flex-1 flex-row gap-2 md:flex-col">
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
            <div className="mt-5 mb-5 gap-2 text-base">
              <div>
                {type && (
                  <>
                    Type : <span className="font-semibold">{type}</span>
                  </>
                )}
                {!attestation && actions.includes('modifier') && (
                  <span className="font-semibold italic">
                    Attestation de constitution des garanties financières manquante
                  </span>
                )}
                {!attestation && !actions.includes('modifier') && (
                  <span className="font-semibold italic">
                    Attestation de constitution des garanties financières à transmettre par
                    l'autorité instructrice compétente
                  </span>
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
                    format="pdf"
                    label="Télécharger l'attestation de constitution"
                    url={Routes.Document.télécharger(attestation)}
                  />
                )}
              </div>
            </div>
            <Actions identifiantProjet={identifiantProjet} actions={actions} />
          </div>
        </div>
      }
    />
    {(mainlevée || (historiqueMainlevée && historiqueMainlevée.length)) && (
      <CallOut
        className="flex-1"
        colorVariant={mainlevée?.statut === 'accordé' ? 'success' : 'warning'}
        content={
          <div className="flex flex-col">
            <Heading2>Mainlevée des garanties financières</Heading2>
            <div className="flex">
              {mainlevée && (
                <MainlevéeEnCours identifiantProjet={identifiantProjet} mainlevée={mainlevée} />
              )}
              {historiqueMainlevée && historiqueMainlevée.length && (
                <HistoriqueMainlevéeRejetée historique={historiqueMainlevée} />
              )}
            </div>
          </div>
        }
      />
    )}
  </div>
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
        <div className="flex flex-col gap-1">
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
        </div>
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
