import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Notice from '@codegouvfr/react-dsfr/Notice';
import Link from 'next/link';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import { ActionMap, ActionsPageTemplate } from '@/components/templates/ActionsPage.template';
import { LinkAction } from '@/components/molecules/LinkAction';

import { ArchivesGarantiesFinancières } from './(archives)/ArchivesGarantiesFinancières';
import { GarantiesFinancières } from './components/GarantiesFinancières';
import { StatutGarantiesFinancièresBadge } from './StatutGarantiesFinancièresBadge';

const actionsGarantiesFinancières = [
  'garantiesFinancières.actuelles.enregistrer',
  'garantiesFinancières.actuelles.enregistrerAttestation',
  'garantiesFinancières.actuelles.modifier',
  'garantiesFinancières.mainlevée.demander',
  'garantiesFinancières.dépôt.soumettre',
] satisfies Role.Policy[];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const alertesGarantiesFinancières = [
  'garantiesFinancières.mainlevée.consulter',
  'garantiesFinancières.dépôt.consulter',
] satisfies Role.Policy[];

export type ActionGarantiesFinancières = (typeof actionsGarantiesFinancières)[number];
export type AlerteGarantiesFinancières = (typeof alertesGarantiesFinancières)[number];

export type DétailsGarantiesFinancièresPageProps = {
  identifiantProjet: string;
  actuelles: PlainType<
    Option.Type<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>
  >;
  archivesGarantiesFinancières: PlainType<Lauréat.GarantiesFinancières.ListerArchivesGarantiesFinancièresReadModel>;
  actions: (ActionGarantiesFinancières | AlerteGarantiesFinancières)[];
};

export const DétailsGarantiesFinancièresPage: FC<DétailsGarantiesFinancièresPageProps> = ({
  identifiantProjet,
  actuelles,
  actions,
  archivesGarantiesFinancières,
}) => {
  const actionMap: ActionMap<ActionGarantiesFinancières> = {
    ['garantiesFinancières.dépôt.soumettre']: () => (
      <LinkAction
        label="Soumettre"
        buttonProps={{ title: 'Soumettre un dépôt de garanties financières' }}
        linkProps={{ href: Routes.GarantiesFinancières.dépôt.soumettre(identifiantProjet) }}
      />
    ),
    'garantiesFinancières.actuelles.enregistrer': () => (
      <LinkAction
        label="Enregistrer"
        buttonProps={{ title: 'Enregistrer des garanties financières' }}
        linkProps={{ href: Routes.GarantiesFinancières.actuelles.enregistrer(identifiantProjet) }}
      />
    ),
    ['garantiesFinancières.actuelles.modifier']: () => (
      <LinkAction
        label="Modifier"
        buttonProps={{ title: 'Modifier les garanties financières actuelles' }}
        linkProps={{ href: Routes.GarantiesFinancières.actuelles.modifier(identifiantProjet) }}
      />
    ),
    ['garantiesFinancières.actuelles.enregistrerAttestation']: () => (
      <LinkAction
        label="Enregistrer l'attestation de constitution"
        buttonProps={{
          title: "Enregistrer l'attestation de constitution des garanties financières",
        }}
        linkProps={{
          href: Routes.GarantiesFinancières.actuelles.enregistrerAttestation(identifiantProjet),
        }}
      />
    ),
    ['garantiesFinancières.mainlevée.demander']: () => (
      <LinkAction
        label="Demander la mainlevée"
        buttonProps={{ title: 'Demander la mainlevée des garanties financières' }}
        linkProps={{
          href: Routes.GarantiesFinancières.demandeMainlevée.demander(identifiantProjet),
        }}
      />
    ),
  };

  const statut = Option.isSome(actuelles)
    ? Lauréat.GarantiesFinancières.StatutGarantiesFinancières.bind(actuelles.statut)
    : undefined;

  return (
    <ActionsPageTemplate
      heading="Détail des garanties financières"
      badge={statut && <StatutGarantiesFinancièresBadge statut={statut.statut} />}
      actionMap={actionMap}
      actions={[...new Set(actionsGarantiesFinancières).intersection(new Set(actions))]}
    >
      <div className="flex flex-col gap-4">
        {actions.includes('garantiesFinancières.mainlevée.consulter') &&
          (statut?.estLevé() ? (
            <Notice
              severity="info"
              title="Mainlevée accordée"
              link={{
                linkProps: {
                  href: Routes.GarantiesFinancières.demandeMainlevée.détails(identifiantProjet),
                  target: '_self',
                },
                text: 'Consulter la mainlevée',
              }}
            />
          ) : (
            <Notice
              severity="info"
              title="Mainlevée en cours"
              description="Une demande de mainlevée des garanties financières est en cours."
              link={{
                linkProps: {
                  href: Routes.GarantiesFinancières.demandeMainlevée.détails(identifiantProjet),
                  target: '_self',
                },
                text: 'Consulter la mainlevée',
              }}
            />
          ))}

        {actions.includes('garantiesFinancières.dépôt.consulter') && (
          <Notice
            severity="info"
            title="Dépôt à traiter"
            description="Un dépôt de nouvelles garanties financières a été soumis et doit être traité."
            link={{
              linkProps: {
                href: Routes.GarantiesFinancières.dépôt.détails(identifiantProjet),
                target: '_self',
              },
              text: 'Consulter le dépôt',
            }}
          />
        )}

        {statut?.estÉchu() && (
          <Notice
            title="Garanties Financières échues"
            severity="info"
            description={
              <>
                La date d'échéance de ces garanties financières est dépassée. Vous pouvez contacter
                le ou les porteurs depuis la page{' '}
                <Link href={Routes.Accès.lister(identifiantProjet, 'classé')}>utilisateurs</Link>.
              </>
            }
          />
        )}

        {Option.isSome(actuelles) ? (
          <GarantiesFinancières
            garantiesFinancières={actuelles.garantiesFinancières}
            document={actuelles.document}
            soumisLe={actuelles.soumisLe}
            validéLe={actuelles.validéLe}
            peutModifier={actions.includes('garantiesFinancières.actuelles.modifier')}
          />
        ) : (
          <Notice severity="info" title="Ce projet ne dispose pas de garanties financières" />
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
};
