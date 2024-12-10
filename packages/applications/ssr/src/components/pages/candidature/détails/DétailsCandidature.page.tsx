import React, { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { PlainType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1, Heading2 } from '@/components/atoms/headings';
import { ProjetBannerTemplate } from '@/components/molecules/projet/ProjetBanner.template';
import { StatutProjetBadge } from '@/components/molecules/projet/StatutProjetBadge';
import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { getGarantiesFinancièresTypeLabel } from '../../garanties-financières/getGarantiesFinancièresTypeLabel';
import { getTechnologieTypeLabel } from '../helpers';
import { getActionnariatTypeLabel } from '../helpers/getActionnariatTypeLabel';

type AvailableActions = Record<
  'corriger' | 'prévisualiserAttestation' | 'téléchargerAttestation',
  boolean
>;

export type DétailsCandidaturePageProps = {
  candidature: PlainType<Candidature.ConsulterCandidatureReadModel>;
  actions: AvailableActions;
};

export const DétailsCandidaturePage: FC<DétailsCandidaturePageProps> = ({
  candidature,
  actions,
}) => {
  const identifiantProjet = IdentifiantProjet.bind(candidature.identifiantProjet);
  return (
    <ColumnPageTemplate
      banner={
        <ProjetBannerTemplate
          identifiantProjet={identifiantProjet}
          href={Routes.Projet.details(identifiantProjet.formatter())}
          nom={candidature.nomProjet}
          localité={candidature.localité}
          badge={
            <div className="flex gap-2">
              <StatutProjetBadge statut={candidature.statut.statut} />
              <NotificationBadge estNotifié={!!candidature.notification} />
            </div>
          }
          dateDésignation={Option.none}
        />
      }
      heading={<Heading1>Détails de la candidature</Heading1>}
      leftColumn={{
        children: (
          <div className="flex flex-col gap-8">
            <FieldGroup name="Informations générales">
              <Field name="Site de production">
                <span>{candidature.localité.adresse1}</span>
                {candidature.localité.adresse2 && <span>{candidature.localité.adresse2}</span>}
                <span>
                  {candidature.localité.codePostal} {candidature.localité.commune}
                </span>
                <span>
                  {candidature.localité.département}, {candidature.localité.région}
                </span>
              </Field>
              <Field name="Actionnaire">
                <span>{candidature.sociétéMère}</span>
              </Field>
              <Field name="Performances">
                <span>Puissance installée: {candidature.puissanceProductionAnnuelle} MW</span>
                <span>
                  Evaluation carbone simplifiée: {candidature.evaluationCarboneSimplifiée} kg eq
                  CO2/kWc
                </span>
                <span>Prix de référence: {candidature.prixReference} €/MWh</span>
              </Field>
              {candidature.typeGarantiesFinancières && (
                <Field name="Garanties Financières">
                  <span>
                    Type:{' '}
                    {getGarantiesFinancièresTypeLabel(candidature.typeGarantiesFinancières.type)}
                  </span>
                  {candidature.dateÉchéanceGf && (
                    <span>
                      Date d'échéance:{' '}
                      <FormattedDate date={DateTime.bind(candidature.dateÉchéanceGf).formatter()} />
                    </span>
                  )}
                </Field>
              )}
              {candidature.technologie && (
                <Field name="Technologie">
                  <span>{getTechnologieTypeLabel(candidature.technologie.type)}</span>
                </Field>
              )}
              {candidature.actionnariat && (
                <Field name="Actionnariat">
                  <span>{getActionnariatTypeLabel(candidature.actionnariat.type)}</span>
                </Field>
              )}
              {/* Cette partie sera sûrement supprimée après la migration de projet */}
              <Field name="Désignation">
                {candidature.notification ? (
                  <>
                    <span>
                      Candidature notifiée le:{' '}
                      <FormattedDate
                        date={DateTime.bind(candidature.notification.notifiéeLe).formatter()}
                      />
                    </span>
                    {candidature.notification.attestation && (
                      <span>
                        Attestation{' '}
                        {DateTime.bind(candidature.notification.notifiéeLe).estAntérieurÀ(
                          DateTime.convertirEnValueType(
                            candidature.notification.attestation.dateCréation,
                          ),
                        )
                          ? 'régénérée'
                          : 'générée'}{' '}
                        le:{' '}
                        <FormattedDate
                          date={DateTime.convertirEnValueType(
                            candidature.notification.attestation.dateCréation,
                          ).formatter()}
                        />
                      </span>
                    )}
                  </>
                ) : (
                  <span>La candidature n'a pas encore été notifiée</span>
                )}
              </Field>
              {candidature.motifÉlimination && (
                <Field name="Motif d'élimination">{candidature.motifÉlimination}</Field>
              )}
            </FieldGroup>
            <FieldGroup name="Contact">
              <Field name="Nom du candidat">{candidature.nomCandidat}</Field>
              <Field name="Nom du représentant légal">{candidature.nomReprésentantLégal}</Field>
              <Field name="Adresse email à la candidature">
                <span>
                  <a href={`mailto:${candidature.emailContact}`}>{candidature.emailContact}</a>
                </span>
              </Field>
            </FieldGroup>
          </div>
        ),
      }}
      rightColumn={{
        className: 'flex flex-col md:items-end gap-4',
        children: mapToActionComponents({
          actions,
          identifiantProjet,
        }),
      }}
    />
  );
};

type MapToActionsComponentsProps = {
  actions: AvailableActions;
  identifiantProjet: IdentifiantProjet.ValueType;
};

const mapToActionComponents = ({ identifiantProjet, actions }: MapToActionsComponentsProps) => (
  <>
    <Heading2>Actions</Heading2>
    {actions.corriger && (
      <Button
        linkProps={{
          href: Routes.Candidature.corriger(identifiantProjet.formatter()),
          prefetch: false,
        }}
      >
        Corriger
      </Button>
    )}
    {actions.téléchargerAttestation && (
      <Button
        linkProps={{
          href: Routes.Candidature.téléchargerAttestation(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
          ),
          prefetch: false,
        }}
        title={`Télécharger l'attestation de désignation`}
        aria-label={`Télécharger l'attestation de désignation`}
        priority="secondary"
        iconId="fr-icon-file-download-line"
        iconPosition="right"
      >
        Télécharger Attestation
      </Button>
    )}
    {actions.prévisualiserAttestation && (
      <Button
        linkProps={{
          href: Routes.Candidature.prévisualiserAttestation(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
          ),
          target: '_blank',
          prefetch: false,
        }}
        title={`Prévisualiser l'attestation de désignation`}
        aria-label={`Prévisualiser l'attestation de désignation`}
        priority="secondary"
      >
        Prévisualiser Attestation
      </Button>
    )}
  </>
);

type FieldProps = { name: string; children: React.ReactNode };
const Field: React.FC<FieldProps> = ({ name, children }) => (
  <fieldset>
    <legend className="font-bold">{name}</legend>
    <div className="flex flex-col">{children}</div>
  </fieldset>
);

type FieldGroupProps = { name: string; children: React.ReactNode };
const FieldGroup: React.FC<FieldGroupProps> = ({ name, children }) => (
  <div>
    <Heading2 className="mb-4">{name}</Heading2>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);
