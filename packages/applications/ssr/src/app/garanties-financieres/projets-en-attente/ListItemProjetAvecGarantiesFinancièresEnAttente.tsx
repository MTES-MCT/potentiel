import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

export type ListItemProjetAvecGarantiesFinancièresEnAttenteProps = {
  identifiantProjet: string;
  nomProjet: string;
  motif: string;
  misÀJourLe: Iso8601DateTime;
  dateLimiteSoumission: Iso8601DateTime;
  afficherModèleMiseEnDemeure: boolean;
};

export const ListItemProjetAvecGarantiesFinancièresEnAttente: FC<
  ListItemProjetAvecGarantiesFinancièresEnAttenteProps
> = ({
  identifiantProjet,
  nomProjet,

  misÀJourLe,
  motif,
  dateLimiteSoumission,
  afficherModèleMiseEnDemeure,
}) => (
  <ListItem
    misÀJourLe={misÀJourLe}
    heading={
      <ProjectListItemHeading
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        nomProjet={nomProjet}
        prefix="Projet"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Projet.details(identifiantProjet),
          'aria-label': `voir le détail du projet ${nomProjet}`,
          prefetch: false,
        }}
      >
        Voir le projet
      </Button>
    }
  >
    <div className="text-sm">
      Motif : <strong>{motif}</strong>
    </div>
    <div className="text-sm">
      Date limite de soumission :{' '}
      <strong>
        <FormattedDate date={dateLimiteSoumission} />
      </strong>
    </div>
    {afficherModèleMiseEnDemeure && (
      <DownloadDocument
        className="mb-4"
        url={Routes.GarantiesFinancières.téléchargerModèleMiseEnDemeure(identifiantProjet)}
        format="docx"
        label="Télécharger un modèle de mise en demeure"
      />
    )}
  </ListItem>
);
