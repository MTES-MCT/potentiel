import type { PlainType } from '@potentiel-domain/core';
import type { Candidature, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import type { ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { TitreChamp } from '@/components/atoms/section/TitreChamp';

export type ContractualisationDétailsProps = {
  puissance: ChampObligatoireAvecAction<PlainType<Lauréat.Puissance.ConsulterPuissanceReadModel>>;
  prixRéférence: Option.Type<Lauréat.ConsulterLauréatReadModel['prixReference']>;
  coefficientKChoisi: Lauréat.ConsulterLauréatReadModel['coefficientKChoisi'];
  volumeRéservé: Candidature.ConsulterCandidatureReadModel['volumeRéservé'];
};

export const ContractualisationDétails = ({
  puissance,
  prixRéférence,
  coefficientKChoisi,
  volumeRéservé,
}: ContractualisationDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <TitreChamp>Performances</TitreChamp>
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
    {Option.isSome(prixRéférence) && (
      <div className="flex flex-col gap-1">
        <TitreChamp>Prix</TitreChamp>
        <span>{prixRéférence} €/MWh</span>
      </div>
    )}
    {coefficientKChoisi !== undefined && (
      <div className="flex flex-col gap-1">
        <TitreChamp>Coefficient K</TitreChamp>
        <span>{coefficientKChoisi ? 'Oui' : 'Non'}</span>
      </div>
    )}
    {volumeRéservé !== undefined && (
      <div className="flex flex-col gap-1">
        <TitreChamp>Volume réservé</TitreChamp>
        <span>
          {volumeRéservé
            ? 'Le projet fait partie du volume réservé de la période'
            : 'Le projet ne fait pas partie du volume réservé de la période'}
        </span>
      </div>
    )}
  </>
);
