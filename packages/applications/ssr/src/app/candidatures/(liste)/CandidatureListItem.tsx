import { FC } from 'react';

import { PlainType } from '@potentiel-domain/core';
import { Email } from '@potentiel-domain/common';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { Icon } from '@/components/atoms/Icon';
import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { StatutCandidatureBadge } from '@/components/molecules/candidature/StatutCandidatureBadge';
import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';

import {
  CandidatureListItemActions,
  CandidatureListItemActionsProps,
} from './CandidatureListItemActions';
import * as symbols from './candidatureListLegendSymbols';

export type CandidatureListItemProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  statut: PlainType<Candidature.StatutCandidature.ValueType>;
  estNotifiée: boolean;
  nomProjet: Candidature.Dépôt.RawType['nomProjet'];
  nomCandidat: Candidature.Dépôt.RawType['nomCandidat'];
  nomReprésentantLégal: Candidature.Dépôt.RawType['nomReprésentantLégal'];
  emailContact: PlainType<Email.ValueType>;
  puissanceProductionAnnuelle: Candidature.Dépôt.RawType['puissanceProductionAnnuelle'];
  prixReference: Candidature.Dépôt.RawType['prixReference'];
  evaluationCarboneSimplifiée: Candidature.Dépôt.RawType['evaluationCarboneSimplifiée'];
  actionnariat?: PlainType<Candidature.TypeActionnariat.ValueType>;
  localité: {
    commune: Candidature.Localité.RawType['commune'];
    département: Candidature.Localité.RawType['département'];
    région: Candidature.Localité.RawType['région'];
  };
  unitéPuissance: string;
  actions: CandidatureListItemActionsProps['actions'];
};

export const CandidatureListItem: FC<CandidatureListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut,
  estNotifiée,
  localité: { commune, département, région },
  nomCandidat,
  nomReprésentantLégal,
  emailContact,
  puissanceProductionAnnuelle,
  actionnariat,
  prixReference,
  unitéPuissance,
  evaluationCarboneSimplifiée,
  actions,
}) => (
  <div className="flex flex-1 flex-col gap-6">
    <div className="flex gap-4 items-start justify-between">
      <ProjectListItemHeading
        identifiantProjet={identifiantProjet}
        nomProjet={nomProjet}
        prefix="Candidature du projet"
        statutBadge={
          <>
            <StatutCandidatureBadge statut={statut.statut} actionnariat={actionnariat?.type} />
            {estNotifiée !== undefined && <NotificationBadge estNotifié={estNotifiée} />}
          </>
        }
      />
      <div className="max-md:hidden">
        <CandidatureListItemActions
          identifiantProjet={identifiantProjet}
          nomProjet={nomProjet}
          actions={actions}
        />
      </div>
    </div>

    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex md:flex-1 flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <Icon id={symbols.localité.iconId} title={symbols.localité.description} size="sm" />
          <span className="italic">
            {commune}, {département}, {région}
          </span>
        </div>

        <div className="flex  items-center gap-2">
          <Icon id={symbols.nomCandidat.iconId} title={symbols.nomCandidat.description} size="sm" />
          {nomCandidat}
        </div>
        <div className="flex items-center gap-2">
          <Icon
            id={symbols.représentantLégal.iconId}
            title={symbols.représentantLégal.description}
            size="sm"
          />
          <div className="flex flex-col overflow-hidden">
            <div>{nomReprésentantLégal}</div>
            <div className="truncate" title={emailContact.email}>
              {emailContact.email}
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4 text-sm md:text-base">
        <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
          <Icon
            id={symbols.puissance.iconId}
            className={symbols.puissance.iconColor}
            title={symbols.puissance.description}
          />
          <div className="lg:flex lg:flex-col items-center text-center">
            {puissanceProductionAnnuelle}
            <span className="italic text-sm">{unitéPuissance}</span>
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
            {evaluationCarboneSimplifiée > 0 ? (
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

    <div className="md:hidden">
      <CandidatureListItemActions
        identifiantProjet={identifiantProjet}
        nomProjet={nomProjet}
        actions={actions}
      />
    </div>
  </div>
);
