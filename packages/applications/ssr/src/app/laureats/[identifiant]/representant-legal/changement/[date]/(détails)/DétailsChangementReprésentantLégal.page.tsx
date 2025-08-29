import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { PlainType } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { Heading2 } from '@/components/atoms/headings';
import { Timeline, TimelineItemProps } from '@/components/organisms/Timeline';
import { ActionsList } from '@/components/templates/ActionsList.template';

import { AccorderChangementReprésentantLégal } from './accorder/AccorderChangementReprésentantLégal.form';
import { RejeterChangementReprésentantLégal } from './rejeter/RejeterChangementReprésentantLégal.form';
import { AnnulerChangementReprésentantLégal } from './annuler/AnnulerChangementReprésentantLégal.form';
import { DétailsChangementReprésentantLégal } from './DétailsChangementReprésentantLégal';

export type AvailableChangementReprésentantLégalAction =
  | 'accorder'
  | 'rejeter'
  | 'annuler'
  | 'corriger'
  | 'enregistrer-changement';

export type DétailsChangementReprésentantLégalPageProps =
  PlainType<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel> & {
    identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
    role: PlainType<Role.ValueType>;
    actions: ReadonlyArray<AvailableChangementReprésentantLégalAction>;
    historique: Array<TimelineItemProps>;
    dateDemandeEnCoursPourLien?: string;
  };

export const DétailsChangementReprésentantLégalPage: FC<
  DétailsChangementReprésentantLégalPageProps
> = ({ identifiantProjet, demande, actions, historique, dateDemandeEnCoursPourLien }) => {
  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();

  return (
    <ColumnPageTemplate
      banner={<ProjetBanner identifiantProjet={idProjet} />}
      leftColumn={{
        children: (
          <div className="flex flex-col gap-8">
            <DétailsChangementReprésentantLégal
              demande={demande}
              dateDemandeEnCoursPourLien={dateDemandeEnCoursPourLien}
              identifiantProjet={identifiantProjet}
            />
            <div>
              <Heading2>Historique</Heading2>
              <Timeline items={historique} />
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
              typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.bind({
                type: demande.typeReprésentantLégal.type,
              }).formatter(),
              nomReprésentantLégal: demande.nomReprésentantLégal,
              dateDemande: DateTime.bind(demande.demandéLe).formatter(),
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
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  nomReprésentantLégal: string;
  dateDemande: string;
};

const mapToActionComponents = ({
  actions,
  identifiantProjet,
  typeReprésentantLégal,
  nomReprésentantLégal,
  dateDemande,
}: MapToActionsComponentsProps) => (
  <ActionsList actionsListLength={actions.length}>
    {actions.includes('enregistrer-changement') && (
      <Button
        priority="secondary"
        linkProps={{
          href: Routes.ReprésentantLégal.changement.enregistrer(identifiantProjet),
        }}
      >
        Faire une nouvelle déclaration de changement
      </Button>
    )}
    {actions.includes('accorder') && (
      <AccorderChangementReprésentantLégal
        identifiantProjet={identifiantProjet}
        typeReprésentantLégal={typeReprésentantLégal}
        nomReprésentantLégal={nomReprésentantLégal}
      />
    )}
    {actions.includes('rejeter') && (
      <RejeterChangementReprésentantLégal identifiantProjet={identifiantProjet} />
    )}

    {actions.includes('corriger') && (
      <Button
        priority="secondary"
        linkProps={{
          href: Routes.ReprésentantLégal.changement.corriger(identifiantProjet, dateDemande),
          prefetch: false,
        }}
        className="block w-1/2 text-center"
      >
        Corriger
      </Button>
    )}

    {actions.includes('annuler') && (
      <AnnulerChangementReprésentantLégal identifiantProjet={identifiantProjet} />
    )}
  </ActionsList>
);
