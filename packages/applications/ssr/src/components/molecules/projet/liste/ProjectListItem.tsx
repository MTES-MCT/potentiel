import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

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
  puissance: {
    valeur: number;
    unité: Candidature.UnitéPuissance.RawType;
  };
  prixReference: Candidature.ConsulterCandidatureReadModel['dépôt']['prixReference'];
  evaluationCarboneSimplifiée: Candidature.ConsulterCandidatureReadModel['dépôt']['evaluationCarboneSimplifiée'];
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
}) => {
  const estÉliminé = statut === 'éliminé';

  return (
    <ListItem
      heading={
        <ProjectListItemHeading
          nomProjet={nomProjet}
          statutBadge={estÉliminé ? <StatutÉliminéBadge /> : <StatutLauréatBadge statut={statut} />}
          identifiantProjet={IdentifiantProjet.convertirEnValueType(identifiantProjet)}
          prefix="Projet"
        />
      }
      actions={
        <Button
          className="md:flex ml-auto"
          linkProps={{
            href: estÉliminé
              ? Routes.Projet.détailsÉliminé(identifiantProjet)
              : Routes.Projet.details(identifiantProjet),
          }}
          aria-label={`Lien vers la page du projet ${nomProjet}`}
        >
          Consulter
        </Button>
      }
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between w-full">
        <div className="flex md:flex-1 flex-col gap-1 text-sm">
          <div className="flex items-start gap-2">
            <Icon
              id={symbols.localité.iconId}
              title={symbols.localité.description}
              className={symbols.localité.iconColor}
              size="sm"
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
              size="sm"
            />
            {producteur}
          </div>
          <div className="flex items-start gap-2">
            <Icon
              id={symbols.représentantLégal.iconId}
              title={symbols.représentantLégal.description}
              className={symbols.représentantLégal.iconColor}
              size="sm"
            />
            {nomReprésentantLégal}
          </div>
          <div className="flex items-start gap-2">
            <Icon
              id={symbols.email.iconId}
              title={symbols.email.description}
              className={symbols.email.iconColor}
              size="sm"
            />
            {email}
          </div>
          {typeActionnariat && (
            <div className="flex items-start gap-2">
              <Icon
                id={symbols.typeActionnariat.iconId}
                title={symbols.typeActionnariat.description}
                size="sm"
              />
              {getActionnariatTypeLabel(typeActionnariat)}
            </div>
          )}
        </div>
        <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4 text-sm md:text-base">
          <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
            <Icon
              id={symbols.puissance.iconId}
              className={symbols.puissance.iconColor}
              title={symbols.puissance.description}
            />
            <div className="lg:flex lg:flex-col items-center text-center">
              {puissance.valeur}
              <span className="italic text-sm">{puissance.unité}</span>
            </div>
          </div>
          <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
            <Icon
              id={symbols.prix.iconId}
              className={symbols.prix.iconColor}
              title={symbols.prix.description}
            />
            <div className="lg:flex lg:flex-col items-center text-center">
              {prixReference}
              <span className="italic text-sm">€ par MWh</span>
            </div>
          </div>
          <div className="flex lg:flex-1 lg:flex-col items-center gap-2 lg:grow">
            <Icon
              id={symbols.évaluationCarbone.iconId}
              className={symbols.évaluationCarbone.iconColor}
              title={symbols.évaluationCarbone.description}
            />
            <div>
              {Number(evaluationCarboneSimplifiée) > 0 ? (
                <div className="lg:flex lg:flex-col items-center text-center">
                  {evaluationCarboneSimplifiée}
                  <span className="italic text-sm"> kg eq CO2/kWc</span>
                </div>
              ) : (
                '- - -'
              )}
            </div>
          </div>
        </div>
      </div>
    </ListItem>
  );
};
