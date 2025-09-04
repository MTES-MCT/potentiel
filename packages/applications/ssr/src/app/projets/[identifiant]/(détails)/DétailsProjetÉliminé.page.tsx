import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Candidature, IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading2 } from '@/components/atoms/headings';
import { CopyButton } from '@/components/molecules/CopyButton';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ActionsList } from '@/components/templates/ActionsList.template';
import { FormattedDate } from '@/components/atoms/FormattedDate';

// TODO: installateur pertinent ?

export type DétailsProjetÉliminéPageProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  éliminé: PlainType<
    Omit<Éliminé.ConsulterÉliminéReadModel, 'prixReference'> & {
      prixReference: Éliminé.ConsulterÉliminéReadModel['prixReference'] | undefined;
    }
  >;
  utilisateursAyantAccèsAuProjet: ReadonlyArray<Email.RawType>;
  actions: Array<DétailsProjetÉliminéActions>;
};

export type DétailsProjetÉliminéActions =
  | 'faire-demande-recours'
  | 'consulter-demande-recours'
  | 'modifier-candidature'
  | 'télécharger-attestation-désignation'
  | 'lister-accès-au-projet'
  | 'gérer-accès-au-projet';

export const DétailsProjetÉliminéPage: FC<DétailsProjetÉliminéPageProps> = ({
  identifiantProjet,
  éliminé: {
    unitéPuissance,
    puissanceProductionAnnuelle,
    localité,
    sociétéMère,
    emailContact,
    prixReference,
    nomCandidat,
    nomReprésentantLégal,
    autorisationDUrbanisme,
  },
  utilisateursAyantAccèsAuProjet,
  actions,
}) => {
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} noLink />}
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
                <span className="font-bold">Site de production :</span> {localité.adresse1}
                {localité.adresse2 ? ` ${localité.adresse2}` : ''} {localité.codePostal}{' '}
                {localité.commune}, {localité.département}, {localité.région}
              </li>
              <li>
                <span className="font-bold">Nom du représentant légal : </span>{' '}
                {nomReprésentantLégal}
              </li>
              {autorisationDUrbanisme && (
                <>
                  <li>
                    <span className="font-bold">Numéro de l'autorisation d'urbanisme : </span>{' '}
                    {autorisationDUrbanisme.numéro}
                  </li>
                  <li>
                    <span className="font-bold">
                      Date d'obtention de l'autorisation d'urbanisme :{' '}
                    </span>
                    {
                      <FormattedDate
                        date={DateTime.convertirEnValueType(
                          autorisationDUrbanisme.date.date,
                        ).formatter()}
                      />
                    }
                  </li>
                </>
              )}
              <li className="flex gap-2 items-center">
                <span className="font-bold">Adresse email de candidature :</span>
                <CopyButton textToCopy={Email.bind(emailContact).formatter()} />
              </li>
              <li>
                <span className="font-bold">Producteur :</span> {nomCandidat}
              </li>
              <li>
                <span className="font-bold">Actionnaire :</span> {sociétéMère}
              </li>
              <li>
                <span className="font-bold">Puissance :</span> {puissanceProductionAnnuelle}{' '}
                {Candidature.UnitéPuissance.bind(unitéPuissance).formatter()}
              </li>
              {prixReference && (
                <li>
                  <span className="font-bold">Prix :</span> {prixReference} €/MWh
                </li>
              )}
              {utilisateursAyantAccèsAuProjet.length && (
                <li>
                  <span className="font-bold">Utilisateurs ayant accès au projet :</span>
                  <ul className="list-disc pl-4">
                    {utilisateursAyantAccèsAuProjet.map((email) => (
                      <li key={email}>
                        <CopyButton textToCopy={email} />
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </section>
        ),
      }}
      rightColumn={{
        children: (
          <>
            {mapToActionComponents({
              actions,
              identifiantProjet,
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

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) => (
  <ActionsList actionsListLength={actions.length}>
    {actions.includes('télécharger-attestation-désignation') && (
      <Button
        linkProps={{
          href: Routes.Candidature.téléchargerAttestation(identifiantProjet),
          prefetch: false,
        }}
        title={`Télécharger l'avis de rejet`}
        aria-label={`Télécharger l'avis de rejet`}
        priority="secondary"
        iconId="fr-icon-file-download-line"
        iconPosition="right"
      >
        Télécharger l'avis de rejet
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
    {actions.includes('consulter-demande-recours') && (
      <Button
        priority="secondary"
        linkProps={{
          href: Routes.Recours.détail(identifiantProjet),
          prefetch: false,
        }}
      >
        Consulter la demande de recours
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
    {(actions.includes('gérer-accès-au-projet') || actions.includes('lister-accès-au-projet')) && (
      <Button
        priority="secondary"
        linkProps={{
          href: Routes.Utilisateur.listerPorteurs(identifiantProjet),
          prefetch: false,
        }}
      >
        {actions.includes('gérer-accès-au-projet')
          ? 'Gérer les accès des utilisateurs au projet'
          : 'Lister les utilisateurs ayant accès au projet'}
      </Button>
    )}
  </ActionsList>
);
