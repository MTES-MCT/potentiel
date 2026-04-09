import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading2 } from '@/components/atoms/headings';
import { ActionsList } from '@/components/templates/ActionsList.template';

import { ArchivesGarantiesFinancières } from './(archives)/ArchivesGarantiesFinancières';
import { GarantiesFinancières } from './components/GarantiesFinancières';
import { AlerteGarantiesFinancières } from './components/AlerteGarantiesFinancières';

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
    type: 'action',
    title: 'Mainlevée en cours',
    // description: 'Une demande de mainlevée des garanties financières est en cours.',
    label: 'Consulter la mainlevée',
    href: Routes.GarantiesFinancières.demandeMainlevée.détails,
  },
  ['garantiesFinancières.dépôt.consulter']: {
    type: 'action',
    title: 'Consulter le dépôt de nouvelles garanties financières',
    label: 'Consulter le dépôt',
    href: Routes.GarantiesFinancières.dépôt.détails,
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
  <ColumnPageTemplate
    heading={<Heading2>Détail des garanties financières</Heading2>}
    leftColumn={{
      children: (
        <>
          {alerteList
            .filter(({ key }) => actions.includes(key))
            .map(({ title, description, action }) => (
              <AlerteGarantiesFinancières
                key={title}
                title={title}
                description={description}
                action={{ label: action.label, href: action.href(identifiantProjet) }}
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
        </>
      ),
    }}
    rightColumn={{
      children: (
        <ActionsList
          actions={actionList
            .filter(({ key }) => actions.includes(key))
            .map(({ href, label, title }) => ({
              label,
              title,
              href: href(identifiantProjet),
            }))}
        />
      ),
    }}
  />
);
