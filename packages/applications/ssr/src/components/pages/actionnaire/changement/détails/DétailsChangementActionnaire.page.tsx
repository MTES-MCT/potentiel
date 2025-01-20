import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Actionnaire } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Heading1, Heading2 } from '@/components/atoms/headings';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { StatutChangementActionnaireBadge } from '../StatutChangementActionnaireBadge';

import { AccorderChangementActionnaire } from './accorder/AccorderChangementActionnaire.form';
import { RejeterChangementActionnaire } from './rejeter/RejeterChangementActionnaire.form';
import { AnnulerChangementActionnaire } from './annuler/AnnulerChangementActionnaire.form';

type ChangementActionnaireActions = 'accorder' | 'rejeter' | 'annuler' | 'demander';

export type DétailsChangementActionnairePagePropsProps =
  PlainType<Actionnaire.ConsulterChangementActionnaireReadModel> & {
    identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
    actions: Array<ChangementActionnaireActions>;
  };

// TODO: ajouter l'historique ici
export const DétailsChangementActionnairePageProps: FC<
  DétailsChangementActionnairePagePropsProps
> = ({
  actionnaire,
  demande: { statut, demandéePar, demandéeLe, raison, pièceJustificative, accord, rejet },
  identifiantProjet,
  actions,
}) => {
  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={idProjet} />}
      heading={
        <Heading1>Détails de la demande en cours de modification de l’actionnariat</Heading1>
      }
      leftColumn={{
        children: (
          <div className="flex flex-col gap-4">
            <Heading2 className="mb-4">Contexte de la demande</Heading2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {accord && (
                  <ChangementAccordé
                    accordéeLe={accord.accordéeLe}
                    accordéePar={accord.accordéePar}
                    réponseSignée={accord.réponseSignée}
                  />
                )}
                {rejet && (
                  <ChangementRejeté
                    rejetéeLe={rejet.rejetéeLe}
                    rejetéePar={rejet.rejetéePar}
                    réponseSignée={rejet.réponseSignée}
                  />
                )}
                {Actionnaire.StatutChangementActionnaire.bind(statut).estDemandé() && (
                  <ChangementDemandé demandéeLe={demandéeLe} demandéePar={demandéePar} />
                )}
              </div>
              <Changement
                actionnaire={actionnaire}
                raison={raison}
                pièceJustificative={pièceJustificative}
              />
            </div>
          </div>
        ),
      }}
      rightColumn={{
        className: 'flex flex-col gap-8',
        children: (
          <>
            {mapToActionComponents({
              actions,
              identifiantProjet: IdentifiantProjet.bind(identifiantProjet).formatter(),
              actionnaire,
            })}
          </>
        ),
      }}
    />
  );
};

type MapToActionsComponentsProps = {
  actions: ReadonlyArray<ChangementActionnaireActions>;
  identifiantProjet: string;
  actionnaire: DétailsChangementActionnairePagePropsProps['actionnaire'];
};

const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) =>
  actions.length ? (
    <div className="flex flex-col gap-4">
      <Heading2>Actions</Heading2>

      {actions.includes('accorder') && (
        <AccorderChangementActionnaire identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('rejeter') && (
        <RejeterChangementActionnaire identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('annuler') && (
        <AnnulerChangementActionnaire identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('demander') && (
        <Button
          priority="secondary"
          linkProps={{
            href: Routes.Actionnaire.changement.demander(identifiantProjet),
          }}
        >
          Faire une nouvelle demande de changement
        </Button>
      )}
    </div>
  ) : null;

type ChangementProps = Pick<
  DétailsChangementActionnairePagePropsProps['demande'],
  'raison' | 'pièceJustificative'
> & { actionnaire: DétailsChangementActionnairePagePropsProps['actionnaire'] };

const Changement: FC<ChangementProps> = ({ actionnaire, pièceJustificative, raison }) => (
  <>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Société mère</div>
      <div>{actionnaire.demandé}</div>
    </div>
    {actionnaire.demandé !== actionnaire.actuel && (
      <div className="flex gap-2">
        <div className="italic whitespace-nowrap">Ancienne société mère</div>
        <div>{actionnaire.actuel}</div>
      </div>
    )}
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Raison du changement :</div>
      <div>{raison}</div>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Pièce(s) justificative(s) :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la pièce justificative"
        format={pièceJustificative.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
      />
    </div>
  </>
);

type ChangementDemandéProps = Pick<
  DétailsChangementActionnairePagePropsProps['demande'],
  'demandéeLe' | 'demandéePar'
>;

const ChangementDemandé: FC<ChangementDemandéProps> = ({ demandéeLe, demandéePar }) => (
  <>
    <div className="text-xs italic">
      Demandé le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(demandéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(demandéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutChangementActionnaireBadge
        statut={Actionnaire.StatutChangementActionnaire.demandé.statut}
      />
    </div>
  </>
);

type ChangementAccordéProps = NonNullable<
  DétailsChangementActionnairePagePropsProps['demande']['accord']
>;

const ChangementAccordé: FC<ChangementAccordéProps> = ({
  accordéeLe,
  accordéePar,
  réponseSignée,
}) => (
  <>
    <div className="text-xs italic">
      Accordée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(accordéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(accordéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutChangementActionnaireBadge
        statut={Actionnaire.StatutChangementActionnaire.accordé.statut}
      />
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Réponse signée :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format={réponseSignée.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
      />
    </div>
  </>
);

type ChangementRejetéProps = NonNullable<
  DétailsChangementActionnairePagePropsProps['demande']['rejet']
>;

const ChangementRejeté: FC<ChangementRejetéProps> = ({ rejetéeLe, rejetéePar, réponseSignée }) => (
  <>
    <div className="text-xs italic">
      Rejetée le{' '}
      <FormattedDate className="font-semibold" date={DateTime.bind(rejetéeLe).formatter()} /> par{' '}
      <span className="font-semibold">{Email.bind(rejetéePar).formatter()}</span>
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Statut :</div>{' '}
      <StatutChangementActionnaireBadge
        statut={Actionnaire.StatutChangementActionnaire.rejeté.statut}
      />
    </div>
    <div className="flex gap-2">
      <div className="font-semibold whitespace-nowrap">Réponse signée :</div>
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format={réponseSignée.format}
        url={Routes.Document.télécharger(DocumentProjet.bind(réponseSignée).formatter())}
      />
    </div>
  </>
);
