import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { ChampObligatoireAvecAction } from '../../../../_helpers/types';
import { Heading6 } from '../../../../../../../components/atoms/headings';

export type ContractualisationDétailsProps = {
  puissance: ChampObligatoireAvecAction<PlainType<Lauréat.Puissance.ConsulterPuissanceReadModel>>;
  prixRéférence: Lauréat.ConsulterLauréatReadModel['prixReference'];
  coefficientKChoisi: Lauréat.ConsulterLauréatReadModel['coefficientKChoisi'];
};

export const ContractualisationDétails = ({
  puissance,
  prixRéférence,
  coefficientKChoisi,
}: ContractualisationDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <Heading6>Performances</Heading6>
      <span>
        Puissance installée : {puissance.value.puissance} {puissance.value.unitéPuissance.unité}
      </span>
      {puissance.value.puissanceDeSite !== undefined && (
        <span>
          Puissance sur site : {puissance.value.puissanceDeSite}{' '}
          {puissance.value.unitéPuissance.unité}
        </span>
      )}
      {puissance.action && (
        <TertiaryLink href={puissance.action.url}>{puissance.action.label}</TertiaryLink>
      )}
    </div>
    <div className="flex flex-col gap-1">
      <Heading6>Prix</Heading6>
      <span>{prixRéférence} €/MWh</span>
    </div>
    <div className="flex flex-col gap-1">
      <Heading6>Coefficient K</Heading6>
      <span>{coefficientKChoisi ? 'Oui' : 'Non'}</span>
    </div>
  </>
);
