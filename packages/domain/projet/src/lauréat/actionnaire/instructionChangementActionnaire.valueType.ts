import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { Candidature } from '../../index.js';

export type ValueType = ReadonlyValueType<{
  typeActionnariat: Candidature.TypeActionnariat.ValueType | undefined;
  aDesGarantiesFinancièresConstituées: boolean;
  aUnDépotEnCours: boolean;
  /**
   * Règle métier, spécifique à l'AO Eolien (pour lequel le type de GF est `après candidature`), pour les porteurs
   * La demande doit être en "instruction" si il n'y a pas de GF validées sur le projet ou si il y a une demande de renouvellement ou de modifications des garanties financières en cours
   * La demande doit être en "instruction" si le candidat a joint à son offre la lettre d’engagement (l'investissement participatif ou financement participatif)
   */
  estRequise: () => boolean;
}>;

export const bind = ({
  typeActionnariat,
  aDesGarantiesFinancièresConstituées,
  aUnDépotEnCours,
}: PlainType<ValueType>): ValueType => {
  return {
    typeActionnariat: typeActionnariat
      ? Candidature.TypeActionnariat.convertirEnValueType(typeActionnariat.type)
      : undefined,
    aDesGarantiesFinancièresConstituées,
    aUnDépotEnCours,
    estÉgaleÀ({ typeActionnariat, aDesGarantiesFinancièresConstituées, aUnDépotEnCours }) {
      return (
        (this.typeActionnariat !== undefined
          ? typeActionnariat !== undefined && this.typeActionnariat.estÉgaleÀ(typeActionnariat)
          : typeActionnariat === undefined) &&
        this.aDesGarantiesFinancièresConstituées === aDesGarantiesFinancièresConstituées &&
        this.aUnDépotEnCours === aUnDépotEnCours
      );
    },
    estRequise() {
      // La demande doit être en "instruction" si il n'y a pas de GF validées sur le projet
      // ou si il y a une demande de renouvellement ou de modifications des garanties financières en cours
      if (!this.aDesGarantiesFinancièresConstituées || this.aUnDépotEnCours) {
        return true;
      }

      // La demande doit être en "instruction" si le candidat a joint à son offre la lettre d’engagement (l'investissement participatif ou financement participatif)
      if (this.typeActionnariat) {
        return (
          this.typeActionnariat?.estFinancementParticipatif() ||
          this.typeActionnariat?.estInvestissementParticipatif()
        );
      }

      // Dans tous les autres cas, l'instruction n'est pas nécessaire
      return false;
    },
  };
};
