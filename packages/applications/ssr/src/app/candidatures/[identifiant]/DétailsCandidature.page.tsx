import React, { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1, Heading2 } from '@/components/atoms/headings';
import { ProjetBannerTemplate } from '@/components/molecules/projet/ProjetBanner.template';
import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import {
  getActionnariatTypeLabel,
  getGarantiesFinancièresTypeLabel,
  getTechnologieTypeLabel,
} from '@/app/_helpers';
import { ActionsList } from '@/components/templates/ActionsList.template';
import { StatutCandidatureBadge } from '@/components/molecules/candidature/StatutCandidatureBadge';

import { ListeFournisseurs } from '../../laureats/[identifiant]/fournisseur/changement/ListeFournisseurs';
import { getNatureDeLExploitationTypeLabel } from '../../_helpers/getNatureDeLExploitationTypeLabel';

type AvailableActions = Record<
  'corriger' | 'modifierLauréat' | 'prévisualiserAttestation' | 'téléchargerAttestation',
  boolean
>;

export type DétailsCandidaturePageProps = {
  candidature: PlainType<Candidature.ConsulterCandidatureReadModel>;
  actions: AvailableActions;
};

export const DétailsCandidaturePage: FC<DétailsCandidaturePageProps> = ({
  candidature: {
    identifiantProjet: { appelOffre, famille, numéroCRE, période },
    dépôt,
    instruction,
    notification,
  },
  actions,
}) => {
  const identifiantProjet = IdentifiantProjet.bind({ appelOffre, famille, numéroCRE, période });
  const garantiesFinancières = dépôt.garantiesFinancières
    ? Lauréat.GarantiesFinancières.GarantiesFinancières.bind(dépôt.garantiesFinancières)
    : undefined;
  return (
    <ColumnPageTemplate
      banner={
        <ProjetBannerTemplate
          identifiantProjet={identifiantProjet}
          href={notification ? Routes.Projet.details(identifiantProjet.formatter()) : undefined}
          nom={dépôt.nomProjet}
          localité={dépôt.localité}
          badge={
            <div className="flex gap-2">
              <StatutCandidatureBadge statut={instruction.statut.statut} />
              <NotificationBadge estNotifié={!!notification} />
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
                <span>{dépôt.localité.adresse1}</span>
                {dépôt.localité.adresse2 && <span>{dépôt.localité.adresse2}</span>}
                <span>
                  {dépôt.localité.codePostal} {dépôt.localité.commune}
                </span>
                <span>
                  {dépôt.localité.département}, {dépôt.localité.région}
                </span>
              </Field>
              <Field name="Société mère">
                <span>{dépôt.sociétéMère || 'Non renseignée'}</span>
              </Field>
              {dépôt.autorisationDUrbanisme !== undefined && (
                <Field name="Autorisation d'urbanisme">
                  <span>Numéro : {dépôt.autorisationDUrbanisme.numéro}</span>
                  <span>
                    Date d'obtention :{' '}
                    {
                      <FormattedDate
                        date={DateTime.convertirEnValueType(
                          dépôt.autorisationDUrbanisme.date.date,
                        ).formatter()}
                      />
                    }
                  </span>
                </Field>
              )}
              {dépôt.installateur !== undefined && (
                <Field name="Installateur">
                  <span>{dépôt.installateur || 'Non renseigné'}</span>
                </Field>
              )}
              {dépôt.natureDeLExploitation && (
                <Field name="Nature de l'exploitation">
                  <span>{getNatureDeLExploitationTypeLabel(dépôt.natureDeLExploitation.type)}</span>
                </Field>
              )}
              {dépôt.installationAvecDispositifDeStockage !== undefined && (
                <Field name="Dispositif de stockage">
                  <span>{dépôt.installationAvecDispositifDeStockage ? 'Avec' : 'Sans'}</span>
                </Field>
              )}
              <Field name="Performances">
                <span>Puissance installée : {dépôt.puissanceProductionAnnuelle} MW</span>
                <span>Prix de référence : {dépôt.prixReference} €/MWh</span>
                {dépôt.puissanceDeSite && (
                  <span>Puissance de site : {dépôt.puissanceDeSite} MW</span>
                )}
              </Field>
              {garantiesFinancières && (
                <Field name="Garanties Financières">
                  <span>
                    Type : {getGarantiesFinancièresTypeLabel(garantiesFinancières.type.type)}
                  </span>
                  {garantiesFinancières.estAvecDateÉchéance() && (
                    <span>
                      Date d'échéance :{' '}
                      <FormattedDate date={garantiesFinancières.dateÉchéance.formatter()} />
                    </span>
                  )}
                  {garantiesFinancières.estExemption() && garantiesFinancières.estConstitué() && (
                    <span>
                      Date de délibération :{' '}
                      <FormattedDate date={garantiesFinancières.constitution.date.formatter()} />
                    </span>
                  )}
                </Field>
              )}
              {dépôt.technologie && (
                <Field name="Technologie">
                  <span>{getTechnologieTypeLabel(dépôt.technologie.type)}</span>
                </Field>
              )}
              {dépôt.coefficientKChoisi !== undefined && (
                <Field name="Coefficient K choisi">
                  <span>{dépôt.coefficientKChoisi ? 'Oui' : 'Non'}</span>
                </Field>
              )}
              {dépôt.actionnariat && (
                <Field name="Actionnariat">
                  <span>{getActionnariatTypeLabel(dépôt.actionnariat.type)}</span>
                </Field>
              )}
              {/* Cette partie sera sûrement supprimée après la migration de projet */}
              <Field name="Désignation">
                {notification ? (
                  <>
                    <span>
                      Candidature notifiée le :{' '}
                      <FormattedDate date={DateTime.bind(notification.notifiéeLe).formatter()} />
                    </span>
                    {notification.attestation && (
                      <span>
                        Attestation{' '}
                        {DateTime.bind(notification.notifiéeLe).estAntérieurÀ(
                          DateTime.convertirEnValueType(notification.attestation.dateCréation),
                        )
                          ? 'régénérée'
                          : 'générée'}{' '}
                        le :{' '}
                        <FormattedDate
                          date={DateTime.convertirEnValueType(
                            notification.attestation.dateCréation,
                          ).formatter()}
                        />
                      </span>
                    )}
                  </>
                ) : (
                  <span>La candidature n'a pas encore été notifiée</span>
                )}
              </Field>
              {instruction.motifÉlimination && (
                <Field name="Motif d'élimination">{instruction.motifÉlimination}</Field>
              )}
            </FieldGroup>
            <FieldGroup name="Contact">
              <Field name="Nom du producteur">{dépôt.nomCandidat}</Field>
              <Field name="Nom du représentant légal">{dépôt.nomReprésentantLégal}</Field>
              <Field name="Adresse email à la candidature">
                <span>
                  <a href={`mailto:${dépôt.emailContact.email}`}>{dépôt.emailContact.email}</a>
                </span>
              </Field>
            </FieldGroup>
            <FieldGroup name="Matériel et Technologie">
              <Field name="Evaluation carbone simplifiée">
                {dépôt.evaluationCarboneSimplifiée} kg eq CO2/kWc
              </Field>
              <Field name="Fournisseurs">
                <ListeFournisseurs
                  fournisseurs={
                    dépôt.fournisseurs.map((fournisseur) =>
                      Lauréat.Fournisseur.Fournisseur.convertirEnValueType({
                        typeFournisseur: fournisseur.typeFournisseur.typeFournisseur,
                        nomDuFabricant: fournisseur.nomDuFabricant,
                        lieuDeFabrication: fournisseur.lieuDeFabrication,
                      }),
                    ) ?? []
                  }
                />
              </Field>
            </FieldGroup>
          </div>
        ),
      }}
      rightColumn={{
        className: 'flex flex-col md:items-center gap-4',
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
  <ActionsList actionsListLength={Object.keys(actions).length}>
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
    {actions.modifierLauréat && (
      <Button
        linkProps={{
          href: Routes.Lauréat.modifier(identifiantProjet.formatter()),
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
  </ActionsList>
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
