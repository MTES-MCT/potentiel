import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Notice from '@codegouvfr/react-dsfr/Notice';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { Heading1 } from '@/components/atoms/headings';
import { ActionsPageTemplate } from '@/components/templates/ActionsPage.template';

import { ArchivesGarantiesFinancières } from './(archives)/ArchivesGarantiesFinancières';
import { GarantiesFinancières } from './components/GarantiesFinancières';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = [
  'garantiesFinancières.actuelles.enregistrer',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.actuelles.modifier',
  'garantiesFinancières.mainlevée.demander',
  'garantiesFinancières.mainlevée.consulter',
  'garantiesFinancières.dépôt.soumettre',
  'garantiesFinancières.dépôt.consulter',
] satisfies Role.Policy[];
export type ActionGarantiesFinancières = (typeof actions)[number];

export type DétailsGarantiesFinancièresPageProps = {
  identifiantProjet: string;
  actuelles: PlainType<
    Option.Type<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>
  >;
  archivesGarantiesFinancières: PlainType<Lauréat.GarantiesFinancières.ListerArchivesGarantiesFinancièresReadModel>;
  actions: ActionGarantiesFinancières[];
};

type Action = {
  label: string;
  title: string;
  href: (identifiantProjet: string) => string;
};

type Alerte = {
  title: string;
  description: string;
  action: { label: string; href: (identifiantProjet: string) => string };
};

type ActionOuAlerte = ({ type: 'action' } & Action) | ({ type: 'alerte' } & Alerte);

const actionsEtAlertesList: Record<ActionGarantiesFinancières, ActionOuAlerte> = {
  ['garantiesFinancières.dépôt.soumettre']: {
    type: 'action',
    label: 'Soumettre',
    title: 'Soumettre un dépôt de garanties financières',
    href: Routes.GarantiesFinancières.dépôt.soumettre,
  },
  'garantiesFinancières.actuelles.enregistrer': {
    type: 'action',
    label: 'Enregistrer',
    title: 'Enregistrer des garanties financières',
    href: Routes.GarantiesFinancières.actuelles.enregistrer,
  },
  ['garantiesFinancières.actuelles.modifier']: {
    type: 'action',
    label: 'Modifier',
    title: 'Modifier les garanties financières actuelles',
    href: Routes.GarantiesFinancières.actuelles.modifier,
  },
  ['garantiesFinancières.actuelles.enregistrerAttestation']: {
    type: 'action',
    label: `Enregistrer l'attestation de constitution`,
    title: "Enregistrer l'attestation de constitution des garanties financières",
    href: Routes.GarantiesFinancières.actuelles.enregistrerAttestation,
  },
  ['garantiesFinancières.mainlevée.demander']: {
    type: 'action',
    label: 'Demander la mainlevée',
    title: 'Demander la mainlevée des garanties financières',
    href: Routes.GarantiesFinancières.demandeMainlevée.demander,
  },
  ['garantiesFinancières.mainlevée.consulter']: {
    type: 'alerte',
    title: 'Mainlevée en cours',
    description: 'Une demande de mainlevée des garanties financières est en cours.',
    action: {
      label: 'Consulter la mainlevée',
      href: Routes.GarantiesFinancières.demandeMainlevée.détails,
    },
  },
  ['garantiesFinancières.dépôt.consulter']: {
    type: 'alerte',
    title: 'Dépôt à traiter',
    description: 'Un dépôt de nouvelles garanties financières a été soumis et doit être traité.',
    action: {
      label: 'Consulter le dépôt',
      href: Routes.GarantiesFinancières.dépôt.détails,
    },
  },
};

const actionList = Object.entries(actionsEtAlertesList)
  .filter(([, actionOuAlerte]) => actionOuAlerte.type === 'action')
  .map(([key, action]) => ({ key: key as ActionGarantiesFinancières, ...(action as Action) }));

const alerteList = Object.entries(actionsEtAlertesList)
  .filter(([, actionOuAlerte]) => actionOuAlerte.type === 'alerte')
  .map(([key, action]) => ({ key: key as ActionGarantiesFinancières, ...(action as Alerte) }));

// aucuneGarantieFinancière: {
//   title: 'Garanties financières manquantes',
//   description: `Aucune garanties financières n'ont été trouvées pour ce projet.`,
//   action: {
//     label: 'Soumettre des garanties financières',
//     href: Routes.GarantiesFinancières.dépôt.soumettre,
//   },
// },
// };

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  identifiantProjet,
  actuelles,
  actions,
  archivesGarantiesFinancières,
}) => (
  <ActionsPageTemplate
    heading={<Heading1>Détail des garanties financières</Heading1>}
    actions={actionList
      .filter(({ key }) => actions.includes(key))
      .map(({ href, label, title }) => ({
        label,
        buttonProps: { title },
        linkProps: { href: href(identifiantProjet) },
      }))}
  >
    <div className="flex flex-col gap-4">
      {alerteList
        .filter(({ key }) => actions.includes(key))
        .map(({ title, description, action }) => (
          <Notice
            key={title}
            severity="info"
            title={title}
            description={description}
            link={{
              linkProps: { href: action.href(identifiantProjet), target: '_self' },
              text: action.label,
            }}
          />
        ))}

      {/* <p>
            La date d'échéance de ces garanties financières est dépassée. Vous pouvez contacter le
            ou les porteurs dont voici la ou les adresses emails :
            <br />
            <CopyButton textToCopy={contactPorteurs.join(',')} />
          </p> */}

      {Option.isSome(actuelles) && (
        <GarantiesFinancières
          garantiesFinancières={actuelles.garantiesFinancières}
          document={actuelles.document}
          soumisLe={actuelles.soumisLe}
          validéLe={actuelles.validéLe}
          peutModifier={actions.includes('garantiesFinancières.actuelles.modifier')}
        />
      )}

      {archivesGarantiesFinancières.length > 0 && (
        <ArchivesGarantiesFinancières archives={archivesGarantiesFinancières} />
      )}

      <Button
        linkProps={{ href: Routes.Lauréat.détails.tableauDeBord(identifiantProjet) }}
        priority="secondary"
        iconId="fr-icon-arrow-left-line"
      >
        Retour au projet
      </Button>
    </div>
  </ActionsPageTemplate>
);
