import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { ChampObligatoireAvecAction } from '../../../../_helpers/types';
import { Heading6 } from '@/components/atoms/headings';
import { getActionnariatTypeLabel } from '../../../../../../_helpers';

export type ActionnariatDétailsProps = {
  actionnaire: ChampObligatoireAvecAction<
    PlainType<Lauréat.Actionnaire.ConsulterActionnaireReadModel>
  >;
  actionnariat: PlainType<Lauréat.ConsulterLauréatReadModel['actionnariat']>;
};

export const ActionnariatDétails = ({ actionnaire, actionnariat }: ActionnariatDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <Heading6>Actionnaire (société mère)</Heading6>
      <span>{actionnaire.value.actionnaire || 'Champ non renseigné'}</span>
      {actionnaire.action && (
        <TertiaryLink href={actionnaire.action.url}>{actionnaire.action.label}</TertiaryLink>
      )}
    </div>
    {actionnariat && (
      <div className="flex flex-col gap-1">
        <Heading6>Type d'actionnariat</Heading6>
        <span>{getActionnariatTypeLabel(actionnariat.type)}</span>
      </div>
    )}
  </>
);
