import { FC } from 'react';
import { match } from 'ts-pattern';
import Button from '@codegouvfr/react-dsfr/Button';

import { PlainType } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Routes } from '@potentiel-applications/routes';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1, Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import {
  HistoriqueTimeline,
  HistoriqueTimelineProps,
} from '@/components/molecules/historique/HistoriqueTimeline';

import { StatutChangementReprésentantLégalBadge } from '../../StatutChangementReprésentantLégalBadge';

import { AccorderChangementReprésentantLégal } from './accorder/AccorderChangementReprésentantLégal.form';
import { RejeterChangementReprésentantLégal } from './rejeter/RejeterChangementReprésentantLégal.form';
import { AnnulerChangementReprésentantLégal } from './annuler/AnnulerChangementReprésentantLégal.form';
import { InfoBoxDemandeEnCours } from './InfoBoxDemandeEnCours';

export type AvailableChangementReprésentantLégalAction =
  | 'accorder'
  | 'rejeter'
  | 'annuler'
  | 'corriger';

export type DétailsChangementReprésentantLégalPageProps =
  PlainType<ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel> & {
    identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
    role: PlainType<Role.ValueType>;
    actions: ReadonlyArray<AvailableChangementReprésentantLégalAction>;
    historique: HistoriqueTimelineProps['historique'];
    dateDemandeEnCoursPourLien?: string;
  };

export const DétailsChangementReprésentantLégalPage: FC<
  DétailsChangementReprésentantLégalPageProps
> = ({
  identifiantProjet,
  demande: {
    statut,
    nomReprésentantLégal,
    typeReprésentantLégal,
    pièceJustificative,
    demandéLe,
    demandéPar,
    accord,
    rejet,
  },
  actions,
  historique,
  dateDemandeEnCoursPourLien,
}) => {
  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={idProjet} />}
      heading={<Heading1>Détail de la demande de changement de représentant légal</Heading1>}
      leftColumn={{
        children: (
          <div className="flex flex-col gap-8">
            {dateDemandeEnCoursPourLien && (
              <InfoBoxDemandeEnCours
                lien={Routes.ReprésentantLégal.changement.détail(
                  idProjet,
                  dateDemandeEnCoursPourLien,
                )}
              />
            )}
            {accord ? (
              <ChangementAccordé
                accordéLe={accord.accordéLe}
                accordéPar={accord.accordéPar}
                nomReprésentantLégal={accord.nomReprésentantLégal}
                typeReprésentantLégal={accord.typeReprésentantLégal}
              />
            ) : rejet ? (
              <ChangementRejeté
                motif={rejet.motif}
                rejetéLe={rejet.rejetéLe}
                rejetéPar={rejet.rejetéPar}
                nomReprésentantLégal={nomReprésentantLégal}
                typeReprésentantLégal={typeReprésentantLégal}
              />
            ) : (
              ReprésentantLégal.StatutChangementReprésentantLégal.bind(statut).estDemandé() && (
                <ChangementDemandé
                  demandéLe={demandéLe}
                  demandéPar={demandéPar}
                  nomReprésentantLégal={nomReprésentantLégal}
                  typeReprésentantLégal={typeReprésentantLégal}
                  pièceJustificative={pièceJustificative}
                />
              )
            )}
            <div className="mb-4">
              <Heading2>Historique</Heading2>
              <HistoriqueTimeline historique={historique} />
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
              typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.bind({
                type: typeReprésentantLégal.type,
              }).formatter(),
              nomReprésentantLégal,
              dateDemande: DateTime.bind(demandéLe).formatter(),
            })}
          </>
        ),
      }}
    />
  );
};

type MapToActionsComponentsProps = {
  actions: ReadonlyArray<AvailableChangementReprésentantLégalAction>;
  identifiantProjet: string;
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  nomReprésentantLégal: string;
  dateDemande: string;
};

const mapToActionComponents = ({
  actions,
  identifiantProjet,
  typeReprésentantLégal,
  nomReprésentantLégal,
  dateDemande,
}: MapToActionsComponentsProps) =>
  actions.length ? (
    <div className="flex flex-col gap-4">
      <Heading2>Actions</Heading2>

      {actions.includes('accorder') && (
        <AccorderChangementReprésentantLégal
          identifiantProjet={identifiantProjet}
          dateDemande={dateDemande}
          typeReprésentantLégal={typeReprésentantLégal}
          nomReprésentantLégal={nomReprésentantLégal}
        />
      )}
      {actions.includes('rejeter') && (
        <RejeterChangementReprésentantLégal
          identifiantProjet={identifiantProjet}
          dateDemande={dateDemande}
        />
      )}

      {actions.includes('annuler') && (
        <AnnulerChangementReprésentantLégal identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('corriger') && (
        <Button
          linkProps={{
            href: Routes.ReprésentantLégal.changement.corriger(identifiantProjet, dateDemande),
            prefetch: false,
          }}
        >
          Corriger
        </Button>
      )}
    </div>
  ) : null;

const getTypeLabel = (type: ReprésentantLégal.TypeReprésentantLégal.RawType) =>
  match(type)
    .returnType<string>()
    .with('personne-physique', () => 'Personne physique')
    .with('personne-morale', () => 'Personne morale')
    .with('collectivité', () => 'Collectivité')
    .with('autre', () => 'Organisme')
    .with('inconnu', () => 'Inconnu')
    .exhaustive();

type ChangementDemandéProps = Omit<
  Omit<DétailsChangementReprésentantLégalPageProps['demande'], 'accord'>,
  'statut'
>;
const ChangementDemandé: FC<ChangementDemandéProps> = ({
  demandéLe,
  demandéPar,
  typeReprésentantLégal,
  nomReprésentantLégal,
  pièceJustificative,
}) => (
  <div>
    <Heading2 className="mb-4">Contexte</Heading2>
    <div className="flex flex-col gap-2">
      <div className="text-xs italic">
        Demandé le{' '}
        <FormattedDate className="font-semibold" date={DateTime.bind(demandéLe).formatter()} /> par{' '}
        <span className="font-semibold">{Email.bind(demandéPar).formatter()}</span>
      </div>
      <div className="flex gap-2">
        <div className="font-semibold">Statut :</div>{' '}
        <StatutChangementReprésentantLégalBadge
          statut={ReprésentantLégal.StatutChangementReprésentantLégal.demandé.formatter()}
        />
      </div>
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">Type :</div>
        <div>
          {getTypeLabel(
            ReprésentantLégal.TypeReprésentantLégal.bind(typeReprésentantLégal).formatter(),
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">Nom représentant légal :</div>
        <div>{nomReprésentantLégal}</div>
      </div>
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">Pièce justificative :</div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format={pièceJustificative.format}
          url={Routes.Document.télécharger(DocumentProjet.bind(pièceJustificative).formatter())}
        />
      </div>
    </div>
  </div>
);

type ChangementAccordéProps = NonNullable<
  DétailsChangementReprésentantLégalPageProps['demande']['accord']
>;

const ChangementAccordé: FC<ChangementAccordéProps> = ({
  typeReprésentantLégal,
  nomReprésentantLégal,
  accordéLe,
  accordéPar,
}) => (
  <div>
    <Heading2 className="mb-4">Contexte</Heading2>
    <div className="flex flex-col gap-2">
      <div className="text-xs italic">
        Accordé le{' '}
        <FormattedDate className="font-semibold" date={DateTime.bind(accordéLe).formatter()} /> par{' '}
        <span className="font-semibold">{Email.bind(accordéPar).formatter()}</span>
      </div>
      <div className="flex gap-2">
        <div className="font-semibold">Statut :</div>{' '}
        <StatutChangementReprésentantLégalBadge
          statut={ReprésentantLégal.StatutChangementReprésentantLégal.accordé.formatter()}
        />
      </div>
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">Type :</div>
        <div>
          {getTypeLabel(
            ReprésentantLégal.TypeReprésentantLégal.bind(typeReprésentantLégal).formatter(),
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">Nom représentant légal :</div>
        <div>{nomReprésentantLégal}</div>
      </div>
    </div>
  </div>
);

type ChangementRejetéProps = NonNullable<
  DétailsChangementReprésentantLégalPageProps['demande']['rejet'] & {
    nomReprésentantLégal: DétailsChangementReprésentantLégalPageProps['demande']['nomReprésentantLégal'];
    typeReprésentantLégal: DétailsChangementReprésentantLégalPageProps['demande']['typeReprésentantLégal'];
  }
>;

const ChangementRejeté: FC<ChangementRejetéProps> = ({
  rejetéLe,
  rejetéPar,
  motif,
  nomReprésentantLégal,
  typeReprésentantLégal,
}) => (
  <div>
    <Heading2 className="mb-4">Contexte</Heading2>
    <div className="flex flex-col gap-2">
      <div className="text-xs italic">
        Rejeté le{' '}
        <FormattedDate className="font-semibold" date={DateTime.bind(rejetéLe).formatter()} /> par{' '}
        <span className="font-semibold">{Email.bind(rejetéPar).formatter()}</span>
      </div>
      <div className="flex gap-2">
        <div className="font-semibold">Statut :</div>{' '}
        <StatutChangementReprésentantLégalBadge
          statut={ReprésentantLégal.StatutChangementReprésentantLégal.rejeté.formatter()}
        />
      </div>
      <div className="flex gap-2">
        <div className="font-semibold">Motif :</div>
        {motif}
      </div>
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">Type :</div>
        <div>
          {getTypeLabel(
            ReprésentantLégal.TypeReprésentantLégal.bind(typeReprésentantLégal).formatter(),
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="font-semibold whitespace-nowrap">Nom représentant légal :</div>
        <div>{nomReprésentantLégal}</div>
      </div>
    </div>
  </div>
);
