import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';

import { getActionnariatTypeLabel } from '@/app/_helpers';
import type { ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { TitreChamp } from '@/components/atoms/section/TitreChamp';

export type ActionnariatDétailsProps = {
  actionnaire: ChampObligatoireAvecAction<
    PlainType<Lauréat.Actionnaire.ConsulterActionnaireReadModel>
  >;
  actionnariat: PlainType<Lauréat.ConsulterLauréatReadModel['actionnariat']>;
};

export const ActionnariatDétails = ({ actionnaire, actionnariat }: ActionnariatDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <TitreChamp>Actionnaire (société mère)</TitreChamp>
      <span>{actionnaire.value.actionnaire || 'Champ non renseigné'}</span>
      {actionnaire.action && (
        <TertiaryLink href={actionnaire.action.url}>{actionnaire.action.label}</TertiaryLink>
      )}
    </div>
    {actionnariat && (
      <div className="flex flex-col gap-1">
        <TitreChamp>Type d'actionnariat</TitreChamp>
        <span>{getActionnariatTypeLabel(actionnariat.type)}</span>
      </div>
    )}
  </>
);
