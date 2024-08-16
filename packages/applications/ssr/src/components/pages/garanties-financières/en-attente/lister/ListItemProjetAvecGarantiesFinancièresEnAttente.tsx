import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/DownloadDocument';
import { ProjectListItemHeading } from '@/components/molecules/ProjectListItemHeading';

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
  <div className="w-full">
    <ProjectListItemHeading
      identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
      nomProjet={nomProjet}
      prefix="Projet"
      misÀJourLe={misÀJourLe}
    />
    <div className="flex flex-col gap-1">
      <div className="mt-3 text-sm">
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
    </div>

    <Link
      href={Routes.Projet.details(identifiantProjet)}
      className="self-end mt-2"
      aria-label={`voir le détail du projet ${nomProjet}`}
    >
      voir le projet
    </Link>
  </div>
);
