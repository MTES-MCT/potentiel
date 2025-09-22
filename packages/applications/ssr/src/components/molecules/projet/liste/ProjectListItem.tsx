import { FC } from 'react';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { Icon } from '@/components/atoms/Icon';

export type ProjectListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  localité: Candidature.Localité.RawType;
  producteur: string;
  email: string;
  nomReprésentantLégal: string;
  puissance: string;
  prixReference: string;
  evaluationCarboneSimplifiée: string;
};

export const ProjectListItem: FC<ProjectListItemProps> = ({
  identifiantProjet,
  nomProjet,
  localité,
  producteur,
  email,
  nomReprésentantLégal,
  puissance,
  prixReference,
  evaluationCarboneSimplifiée,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        prefix="Projet"
      />
    }
    actions={
      <Link
        href={Routes.Projet.details(identifiantProjet)}
        aria-label={`voir le détail du projet ${nomProjet}`}
      >
        voir le détail
      </Link>
    }
  >
    <div className="flex flex-col gap-6 mb-4 text-xs md:mb-8 md:flex-row md:justify-between md:items-start  ">
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center">
          <Icon
            id="ri-map-pin-line"
            className="mr-2 shrink-0"
            title="Localité du projet"
            size="xs"
          />
          {localité.commune}, {localité.région}
        </div>
        <div className="flex items-center">
          <Icon
            id="ri-building-line"
            className="mr-2 shrink-0"
            title="Nom du producteur"
            size="xs"
          />
          {producteur}
        </div>
        <div className="flex items-center">
          <Icon id="ri-user-line" className="mr-2 shrink-0" title="Représentant légal" size="xs" />
          {nomReprésentantLégal}
        </div>
        <div className="flex items-center">
          <Icon id="ri-mail-line" className="mr-2 shrink-0" title="Email" size="xs" />
          {email}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start md:flex-row  md:gap-16">
        <div className="flex fled-row gap-2 md:flex-col md:items-center">
          <Icon id="ri-flashlight-fill" className="shrink-0" title="Puissance" />
          {puissance}
        </div>
        <div className="flex fled-row gap-2 md:flex-col md:items-center">
          <Icon
            id="ri-money-euro-circle-line"
            className="shrink-0 fr-icon--xs md:fr-icon--md"
            title="Prix de référence"
          />
          {prixReference}
        </div>
        <div className="flex fled-row gap-2 md:flex-col md:items-center">
          <Icon
            id="ri-cloud-fill"
            className="shrink-0 fr-icon--xs md:fr-icon--md"
            title="Prix de référence"
          />
          {evaluationCarboneSimplifiée}
        </div>
      </div>
    </div>
  </ListItem>
);
