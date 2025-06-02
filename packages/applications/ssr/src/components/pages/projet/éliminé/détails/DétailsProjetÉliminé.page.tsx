import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading2 } from '@/components/atoms/headings';
import { Icon } from '@/components/atoms/Icon';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { CopyButton } from '@/components/molecules/CopyButton';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

export type DétailsProjetÉliminéPageProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  candidature: Candidature.ConsulterCandidatureReadModel;
  actions: Array<DétailsProjetÉliminéActions>;
};

export type DétailsProjetÉliminéActions = 'faire-demande-recours' | 'modifier-candidature';

export const DétailsProjetÉliminéPage: FC<DétailsProjetÉliminéPageProps> = ({
  identifiantProjet,
  notifiéLe,
  candidature: {
    puissanceProductionAnnuelle,
    localité,
    sociétéMère,
    nomCandidat,
    nomReprésentantLégal,
    emailContact,
    evaluationCarboneSimplifiée,
  },
  actions,
}) => {
  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={idProjet} noLink />}
      leftColumn={{
        children: (
          <div className="flex flex-col gap-8">
            {actions.includes('faire-demande-recours') && (
              <Alert
                severity="warning"
                small
                description={
                  <div className="p-2">
                    <p>
                      Le projet ayant été éliminé lors de la désignation, vous avez la possibilité
                      de{' '}
                      <Link href={Routes.Recours.demander(idProjet)} className="font-semibold">
                        faire une demande de recours
                      </Link>{' '}
                      si vous estimez que l'administration doit étudier à nouveau votre dossier
                    </p>
                  </div>
                }
              />
            )}
            <section>
              <Heading2>
                <Icon id="fr-icon-building-line" size="md" /> Informations générales
              </Heading2>
              <ul className="flex-col gap-4 mt-2">
                <li>
                  Date de notification :{' '}
                  <FormattedDate className="font-bold" date={notifiéLe.formatter()} />
                </li>
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
                  Département : <span className="font-bold">{localité.département}</span>
                </li>
                <li>
                  Région : <span className="font-bold">{localité.région}</span>
                </li>
              </ul>
            </section>
            <section>
              <Heading2>
                <Icon id="fr-icon-settings-5-line" size="md" /> Matériel et technologies
              </Heading2>
              <ul className="flex-col gap-4 mt-2">
                <li>
                  Fournisseur : <span className="font-bold">TODO 🤔 ???</span>
                </li>
                <li>
                  Evaluation carbone :{' '}
                  <span className="font-bold">{evaluationCarboneSimplifiée}</span>
                </li>
              </ul>
            </section>
            <section>
              <Heading2>
                <Icon id="fr-icon-user-line" size="md" /> Contact
              </Heading2>
              <ul className="flex-col gap-4 mt-2">
                <li>
                  Addresse email de candidature :{' '}
                  <CopyButton textToCopy={emailContact.formatter()} />
                </li>
                <li>
                  Actionnaire : <span className="font-bold">{sociétéMère}</span>
                </li>
                <li>
                  Producteur : <span className="font-bold">{nomCandidat}</span>
                </li>
                <li>
                  Représentant légal : <span className="font-bold">{nomReprésentantLégal}</span>
                </li>
                <li>
                  Comptes ayant accès à ce projet : <span className="font-bold">TODO 🤔 ???</span>
                </li>
              </ul>
            </section>
          </div>
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
  identifiantProjet: string;
};

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) =>
  actions.length ? (
    <div className="flex flex-col gap-4">
      <Heading2>Actions</Heading2>

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
