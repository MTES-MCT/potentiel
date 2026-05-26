import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { getGarantiesFinancièresMotifLabel } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/getGarantiesFinancièresMotifLabel';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ListItem } from '@/components/molecules/ListItem';
import { PPABadge } from '@/components/molecules/projet/lauréat/PPABadge';
import { StatutLauréatBadge } from '@/components/molecules/projet/lauréat/StatutLauréatBadge';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';

export type ListItemProjetAvecGarantiesFinancièresEnAttenteActions = 'mise-en-demeure'[];
export type ListItemProjetAvecGarantiesFinancièresEnAttenteProps = PlainType<
  Lauréat.GarantiesFinancières.GarantiesFinancièresEnAttenteListItemReadModel & {
    actions: ListItemProjetAvecGarantiesFinancièresEnAttenteActions;
  }
>;

export const ListItemProjetAvecGarantiesFinancièresEnAttente: FC<
  ListItemProjetAvecGarantiesFinancièresEnAttenteProps
> = ({
  identifiantProjet,
  nomProjet,
  dernièreMiseÀJour: {
    date: { date: misÀJourLe },
  },
  statut: { statut },
  estPartiEnPPA,
  motif: { motif },
  dateLimiteSoumission: { date: dateLimiteSoumission },
  actions,
}) => (
  <ListItem
    miseÀJourLe={misÀJourLe}
    heading={
      <ProjectListItemHeading
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet)}
        nomProjet={nomProjet}
        prefix="Projet"
        statutProjetBadge={
          <div className="flex gap-1">
            <StatutLauréatBadge statut={statut} />
            {estPartiEnPPA && <PPABadge />}
          </div>
        }
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
          'aria-label': `voir le détail du projet ${nomProjet}`,
        }}
      >
        Voir le projet
      </Button>
    }
  >
    <div className="text-sm">
      Motif : <strong>{getGarantiesFinancièresMotifLabel(motif)}</strong>
    </div>
    <div className="text-sm">
      Date limite de soumission :{' '}
      <strong>
        <FormattedDate date={dateLimiteSoumission} />
      </strong>
    </div>
    {actions.includes('mise-en-demeure') && (
      <DownloadDocument
        className="mb-4"
        url={Routes.GarantiesFinancières.téléchargerModèleMiseEnDemeure(
          IdentifiantProjet.bind(identifiantProjet).formatter(),
        )}
        format="docx"
        label="Télécharger un modèle de mise en demeure"
      />
    )}
  </ListItem>
);
