import { FC } from 'react';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Email } from '@potentiel-domain/common';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { Icon } from '@/components/atoms/Icon';
import { getActionnariatTypeLabel } from '@/app/_helpers';

import * as symbols from './ProjectListLegendAndSymbols';

export type ProjectListItemProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  nomProjet: string;
  localité: PlainType<Candidature.Localité.ValueType>;
  producteur: string;
  email: PlainType<Email.ValueType>;
  nomReprésentantLégal: string;
  puissance: {
    valeur: number;
    unité: PlainType<Candidature.UnitéPuissance.ValueType>;
  };
  prixReference: number;
  evaluationCarboneSimplifiée: number;
  typeActionnariat?: PlainType<Candidature.TypeActionnariat.ValueType>;
  statutBadge?: React.ReactNode;
  actions?: React.ReactNode;
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
  typeActionnariat,
  statutBadge,
  actions,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        statutBadge={statutBadge}
        identifiantProjet={identifiantProjet}
        prefix="Projet"
      />
    }
    actions={actions}
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
          {Email.bind(email).formatter()}
        </div>
        {typeActionnariat && (
          <div className="flex items-start gap-2">
            <Icon
              id={symbols.typeActionnariat.iconId}
              title={symbols.typeActionnariat.description}
              size="sm"
            />
            {getActionnariatTypeLabel(
              Candidature.TypeActionnariat.bind(typeActionnariat).formatter(),
            )}
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
            <span className="italic text-sm">
              {Candidature.UnitéPuissance.bind(puissance.unité).formatter()}
            </span>
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
