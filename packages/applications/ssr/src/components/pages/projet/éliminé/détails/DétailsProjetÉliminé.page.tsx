import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading2 } from '@/components/atoms/headings';
import { CopyButton } from '@/components/molecules/CopyButton';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

export type DétailsProjetÉliminéPageProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  candidature: {
    puissanceProductionAnnuelle: Candidature.ConsulterCandidatureReadModel['puissanceProductionAnnuelle'];
    localité: Candidature.ConsulterCandidatureReadModel['localité'];
    sociétéMère: Candidature.ConsulterCandidatureReadModel['sociétéMère'];
    emailContact: Candidature.ConsulterCandidatureReadModel['emailContact'];
    prixReference: Candidature.ConsulterCandidatureReadModel['prixReference'];
  };
  actions: Array<DétailsProjetÉliminéActions>;
};

export type DétailsProjetÉliminéActions =
  | 'faire-demande-recours'
  | 'modifier-candidature'
  | 'télécharger-attestation-désignation';

export const DétailsProjetÉliminéPage: FC<DétailsProjetÉliminéPageProps> = ({
  identifiantProjet,
  candidature: { puissanceProductionAnnuelle, localité, sociétéMère, emailContact, prixReference },
  actions,
}) => {
  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={idProjet} noLink />}
      leftColumn={{
        children: (
          <section className="flex flex-col gap-4">
            <Heading2
              icon={{
                id: 'fr-icon-building-line',
                size: 'md',
              }}
            >
              Informations générales
            </Heading2>
            <ul className="flex-col gap-4 mt-2">
              <li>
                Puissance: <span className="font-bold">{puissanceProductionAnnuelle}</span>
              </li>
              <li>
                Site de production :{' '}
                <span className="font-bold">
                  {localité.adresse1}
                  {localité.adresse2 ? ` ${localité.adresse2}` : ''} {localité.codePostal}{' '}
                  {localité.commune}, {localité.département}, {localité.région}
                </span>
              </li>
              <li>
                Actionnaire : <span className="font-bold">{sociétéMère}</span>
              </li>
              <li className="flex gap-2 items-center">
                <span>Addresse email de candidature :</span>
                <CopyButton textToCopy={emailContact.formatter()} className="font-bold" />
              </li>
              <li>
                Prix : <span className="font-bold">{prixReference} €/MWh</span>{' '}
              </li>
            </ul>
          </section>
        ),
      }}
      rightColumn={{
        children: (
          <>
            {mapToActionComponents({
              actions,
              identifiantProjet: idProjet,
            })}
          </>
        ),
      }}
    />
  );
};

type MapToActionsComponentsProps = {
  actions: ReadonlyArray<DétailsProjetÉliminéActions>;
  identifiantProjet: IdentifiantProjet.RawType;
};

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) =>
  actions.length ? (
    <div className="flex flex-col gap-4">
      <Heading2>Actions</Heading2>

      {actions.includes('télécharger-attestation-désignation') && (
        <Button
          linkProps={{
            href: Routes.Candidature.téléchargerAttestation(identifiantProjet),
            prefetch: false,
          }}
          title={`Télécharger l'attestation de désignation`}
          aria-label={`Télécharger l'attestation de désignation`}
          priority="secondary"
          iconId="fr-icon-file-download-line"
          iconPosition="right"
        >
          Télécharger l'attestation de désignation
        </Button>
      )}

      {actions.includes('faire-demande-recours') && (
        <Button
          priority="secondary"
          linkProps={{
            href: Routes.Recours.demander(identifiantProjet),
            prefetch: false,
          }}
        >
          Faire une demande de recours
        </Button>
      )}

      {actions.includes('modifier-candidature') && (
        <Button
          priority="secondary"
          linkProps={{
            href: Routes.Candidature.corriger(identifiantProjet),
            prefetch: false,
          }}
        >
          Modifier la candidature
        </Button>
      )}
    </div>
  ) : null;
