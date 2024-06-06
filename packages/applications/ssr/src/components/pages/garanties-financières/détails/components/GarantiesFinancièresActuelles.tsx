import Button from '@codegouvfr/react-dsfr/Button';
import Download from '@codegouvfr/react-dsfr/Download';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { CallOut } from '@/components/atoms/CallOut';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading2 } from '@/components/atoms/headings';

import { DemanderMainLevéeGarantiesFinancières } from '../../mainLevée/demander/DemanderMainLevéeGarantiesFinancières';
import { AnnulerMainLevéeGarantiesFinancières } from '../../mainLevée/annuler/AnnulerMainLevéeGarantiesFinancières';

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
      | 'demander-main-levée-gf-pour-projet-abandonné'
      | 'demander-main-levée-gf-pour-projet-achevé'
      | 'annuler-main-levée-gf'
    >;
  };
  mainLevée?: {
    statut: GarantiesFinancières.StatutMainLevéeGarantiesFinancières.RawType;
    motif: GarantiesFinancières.MotifDemandeMainLevéeGarantiesFinancières.RawMotif;
    demandéLe: Iso8601DateTime;
  };
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
  mainLevée,
}) => (
  <>
    <CallOut
      className="flex-1"
      colorVariant={actions.includes('enregister-attestation') ? 'warning' : 'success'}
      content={
        <>
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
                <span className="font-semibold italic">Type de garanties financières manquant</span>
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
                <Download
                  details="fichier au format pdf"
                  label="Télécharger l'attestation"
                  linkProps={{
                    href: Routes.Document.télécharger(attestation),
                    target: '_blank',
                  }}
                />
              )}
            </div>
          </div>
          {mainLevée && (
            <div className="font-semibold text-base">
              Le porteur de projet a déposé une demande de main-levée en date du{' '}
              <FormattedDate className="font-semibold" date={mainLevée.demandéLe} /> suite à{' '}
              {mainLevée.motif === 'projet-abandonné' ? `l'abandon` : `l'achèvement`} du projet.
            </div>
          )}
          <Actions identifiantProjet={identifiantProjet} actions={actions} />
        </>
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
    <>
      {actions.includes('modifier') && (
        <Button
          linkProps={{
            href: Routes.GarantiesFinancières.actuelles.modifier(identifiantProjet),
          }}
        >
          Modifier
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
      {(actions.includes('demander-main-levée-gf-pour-projet-abandonné') ||
        actions.includes('demander-main-levée-gf-pour-projet-achevé')) && (
        <>
          <DemanderMainLevéeGarantiesFinancières
            identifiantProjet={identifiantProjet}
            motif={
              actions.includes('demander-main-levée-gf-pour-projet-abandonné')
                ? 'projet-abandonné'
                : 'projet-achevé'
            }
          />
        </>
      )}
      {actions.includes('annuler-main-levée-gf') && (
        <AnnulerMainLevéeGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
    </>
  );
};
