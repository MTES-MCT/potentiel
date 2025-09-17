import { FC } from 'react';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { Icon } from '@/components/atoms/Icon';

export type LauréatListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  localité: Candidature.Localité.RawType;
  producteur: string;
  représentantLégal: { nom: string; email: string };
  puissance: string;
  prixReference: string;
  evaluationCarboneSimplifiée: string;
};

export const LauréatListItem: FC<LauréatListItemProps> = ({
  identifiantProjet,
  nomProjet,
  localité,
  producteur,
  représentantLégal,
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
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="flex flex-col gap-2 text-xs">
        <div className="flex items-center">
          <Icon
            id="ri-map-pin-line"
            className="mr-2 shrink-0"
            title="Localité du projet"
            size="xs"
          />
          {localité.commune}, {localité.département}, {localité.région}
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
          <div className="flex flex-col">
            {représentantLégal.nom} ({représentantLégal.email})
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-10 md:gap-16">
        <div className="flex flex-col gap-2 items-center">
          <Icon
            id="ri-flashlight-fill"
            className="mr-2 shrink-0"
            title="Représentant légal"
            size="md"
          />
          {puissance}
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Icon
            id="ri-money-euro-circle-line"
            className="mr-2 shrink-0"
            title="Prix de référence"
            size="md"
          />
          {prixReference}
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Icon id="ri-cloud-fill" className="mr-2 shrink-0" title="Prix de référence" size="md" />
          {evaluationCarboneSimplifiée}
        </div>
      </div>
    </div>
  </ListItem>
);
