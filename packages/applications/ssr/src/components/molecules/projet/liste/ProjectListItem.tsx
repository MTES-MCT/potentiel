import { FC } from 'react';
import Link from 'next/link';
import { match, P } from 'ts-pattern';

import { Routes } from '@potentiel-applications/routes';
import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { Icon } from '@/components/atoms/Icon';
import { getActionnariatTypeLabel } from '@/app/_helpers';

import { StatutÉliminéBadge } from '../éliminé/StatutÉliminéBadge';
import { StatutLauréatBadge } from '../lauréat/StatutLauréatBadge';

import * as symbols from './ProjectListLegendAndSymbols';

export type ProjectListItemProps = {
  identifiantProjet: string;
  nomProjet: string;
  localité: Candidature.Localité.RawType;
  statut: Lauréat.StatutLauréat.RawType | 'éliminé';
  producteur: string;
  email: string;
  nomReprésentantLégal: string;
  puissance: string;
  prixReference: string;
  evaluationCarboneSimplifiée: string;
  typeActionnariat?: Candidature.TypeActionnariat.RawType;
};

export const ProjectListItem: FC<ProjectListItemProps> = ({
  identifiantProjet,
  nomProjet,
  localité,
  producteur,
  email,
  statut,
  nomReprésentantLégal,
  puissance,
  prixReference,
  evaluationCarboneSimplifiée,
  typeActionnariat,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        statutBadge={match(statut)
          .with('éliminé', () => <StatutÉliminéBadge />)
          .with(P.union('actif', 'achevé', 'abandonné'), (statut) => (
            <StatutLauréatBadge statut={statut} />
          ))
          .exhaustive()}
        identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
        prefix="Projet"
      />
    }
    actions={
      <Link
        href={Routes.Projet.details(identifiantProjet)}
        aria-label={`voir le détail du projet ${nomProjet}`}
        prefetch={false}
      >
        voir le détail
      </Link>
    }
  >
    <div className="flex flex-col gap-6 mb-4 md:mb-8 md:flex-row md:justify-between md:items-start  ">
      <div className="flex flex-col gap-2 text-xs">
        <div className="flex items-start gap-2">
          <Icon
            id={symbols.localité.iconId}
            title={symbols.localité.description}
            className={symbols.localité.iconColor}
            size="xs"
          />
          <div>
            {localité.commune}, {localité.département}, {localité.région}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Icon
            id={symbols.nomProducteur.iconId}
            title={symbols.nomProducteur.description}
            className={symbols.nomProducteur.iconColor}
            size="xs"
          />
          {producteur}
        </div>
        <div className="flex items-start gap-2">
          <Icon
            id={symbols.représentantLégal.iconId}
            title={symbols.représentantLégal.description}
            className={symbols.représentantLégal.iconColor}
            size="xs"
          />
          {nomReprésentantLégal}
        </div>
        <div className="flex items-start gap-2">
          <Icon
            id={symbols.email.iconId}
            title={symbols.email.description}
            className={symbols.email.iconColor}
            size="xs"
          />
          {email}
        </div>
        {typeActionnariat && (
          <div className="flex items-start gap-2">
            <Icon
              id={symbols.typeActionnariat.iconId}
              title={symbols.typeActionnariat.description}
              size="xs"
            />
            {getActionnariatTypeLabel(typeActionnariat)}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 items-start md:flex-row  md:gap-16 text-sm">
        <div className="flex fled-row gap-2 md:flex-col md:items-center">
          <Icon
            id={symbols.puissance.iconId}
            className={symbols.puissance.iconColor}
            title={symbols.puissance.description}
          />
          {puissance}
        </div>
        <div className="flex fled-row gap-2 md:flex-col md:items-center">
          <Icon
            id={symbols.prix.iconId}
            className={symbols.prix.iconColor}
            title={symbols.prix.description}
          />
          {prixReference}
        </div>
        <div className="flex fled-row gap-2 md:flex-col md:items-center">
          <Icon
            id={symbols.évaluationCarbone.iconId}
            className={symbols.évaluationCarbone.iconColor}
            title={symbols.évaluationCarbone.description}
          />
          {evaluationCarboneSimplifiée}
        </div>
      </div>
    </div>
  </ListItem>
);
