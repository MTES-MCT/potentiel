import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { PlainType } from '@potentiel-domain/core';
// import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Routes } from '@potentiel-applications/routes';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading1, Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

import { StatutChangementReprésentantLégalBadge } from '../StatutChangementReprésentantLégalBadge';

import { EtapesChangementReprésentantLégal } from './EtapesChangementReprésentantLégal';
import { AccorderChangementReprésentantLégal } from './accorder/AccorderChangementReprésentantLégal.form';
import { RejeterChangementReprésentantLégal } from './rejeter/RejeterChangementReprésentantLégal.form';
import { AnnulerChangementReprésentantLégal } from './annuler/AnnulerChangementReprésentantLégal.form';

export type AvailableChangementReprésentantLégalAction =
  | 'accorder'
  | 'rejeter'
  | 'modifier'
  | 'annuler';

export type DétailsChangementReprésentantLégalPageProps = {
  identifiantProjet: string;
  // changementReprésentantLégal: PlainType<ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel>;
  changementReprésentantLégal: PlainType<{
    identifiantProjet: IdentifiantProjet.ValueType;
    statut: 'accordé' | 'annulé' | 'demandé' | 'rejeté';
    demande: {
      typePersonne: string;
      nomReprésentantLégal: string;
      piècesJustificatives: Array<DocumentProjet.ValueType>;
      demandéLe: DateTime.ValueType;
      demandéPar: Email.ValueType;
      accord?: {
        typePersonne: string;
        nomReprésentantLégal: string;
        accordéLe: DateTime.ValueType;
        accordéPar: Email.ValueType;
      };
      rejet?: {
        rejetéLe: DateTime.ValueType;
        rejetéPar: Email.ValueType;
      };
    };
  }>;
  role: PlainType<Role.ValueType>;
  actions: ReadonlyArray<AvailableChangementReprésentantLégalAction>;
};

export const DétailsChangementReprésentantLégalPage: FC<
  DétailsChangementReprésentantLégalPageProps
> = ({ identifiantProjet, role, changementReprésentantLégal, actions }) => {
  const demandéLe = DateTime.bind(changementReprésentantLégal.demande.demandéLe).formatter();
  const demandéPar = Email.bind(changementReprésentantLégal.demande.demandéPar).formatter();
  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
      heading={<Heading1>Détail du changement de représentant légal</Heading1>}
      leftColumn={{
        children: (
          <div className="flex flex-col gap-8">
            <div>
              <Heading2 className="mb-4">Contexte</Heading2>
              <div className="flex flex-col gap-2">
                <div className="text-xs italic">
                  Demandé le <FormattedDate className="font-semibold" date={demandéLe} /> par{' '}
                  <span className="font-semibold">{demandéPar}</span>
                </div>
                <div>
                  Statut :{' '}
                  <StatutChangementReprésentantLégalBadge
                    statut={changementReprésentantLégal.statut}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="whitespace-nowrap">Type de personne :</div>
                  <blockquote className="font-semibold italic">
                    "{changementReprésentantLégal.demande.typePersonne}"
                  </blockquote>
                </div>
                <div className="flex gap-2">
                  <div className="whitespace-nowrap">Nom représentant légal :</div>
                  <blockquote className="font-semibold italic">
                    "{changementReprésentantLégal.demande.nomReprésentantLégal}"
                  </blockquote>
                </div>
                <div className="flex gap-2">
                  <div className="whitespace-nowrap">Pièce justificative :</div>
                  {changementReprésentantLégal.demande.piècesJustificatives.map(
                    (pièceJustificative) => (
                      <blockquote className="font-semibold italic">
                        <DownloadDocument
                          className="mb-0"
                          label="Télécharger la pièce justificative"
                          format={pièceJustificative.format}
                          url={Routes.Document.télécharger(
                            DocumentProjet.bind(pièceJustificative).formatter(),
                          )}
                        />
                      </blockquote>
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <Heading2>Historique</Heading2>
              <EtapesChangementReprésentantLégal
                changementReprésentantLégal={changementReprésentantLégal}
                role={role}
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
              identifiantProjet,
              typePersonne: changementReprésentantLégal.demande.typePersonne,
              nomReprésentantLégal: changementReprésentantLégal.demande.nomReprésentantLégal,
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
  typePersonne: string;
  nomReprésentantLégal: string;
};

const mapToActionComponents = ({
  actions,
  identifiantProjet,
  typePersonne,
  nomReprésentantLégal,
}: MapToActionsComponentsProps) =>
  actions.length ? (
    <div className="flex flex-col gap-4">
      <Heading2>Actions</Heading2>

      {actions.includes('accorder') && (
        <AccorderChangementReprésentantLégal
          identifiantProjet={identifiantProjet}
          typePersonne={typePersonne}
          nomReprésentantLégal={nomReprésentantLégal}
        />
      )}
      {actions.includes('rejeter') && (
        <RejeterChangementReprésentantLégal identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('modifier') && (
        <Button priority="secondary" className="block w-1/2 text-center" linkProps={{ href: '#' }}>
          Modifier
        </Button>
      )}
      {actions.includes('annuler') && (
        <AnnulerChangementReprésentantLégal identifiantProjet={identifiantProjet} />
      )}
    </div>
  ) : null;
