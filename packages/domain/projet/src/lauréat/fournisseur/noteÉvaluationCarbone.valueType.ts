import { AppelOffre } from '@potentiel-domain/appel-offre';
import { PlainType } from '@potentiel-domain/core';

export type ValueType = Readonly<{
  évaluationCarboneInitiale: number;
  nouvelleÉvaluationCarbone: number;
  technologie: AppelOffre.Technologie;

  estDégradée(): boolean;
}>;

/**
 * Permet de vérifier si la note risque d'être dégradée suite à un changement d'évaluation carbone.
 *
 * Dans le paragraphe du cahier des charges des AO PV relatif au calcul de la notation de l’évaluation carbone simplifié,
 * il est précisé que l'évaluation carbone simplifiée doit être "arrondie au multiple de 50 le plus proche".
 *
 * On compare l'évaluation carbone à sa valeur initiale pour savoir si le changement est impactant.
 *
 * @see https://www.cre.fr/fileadmin/Documents/Appels_d_offres/2025/CDC_PPE2_Sol_P8.pdf, paragraphe 4.3
 */
export const bind = ({
  évaluationCarboneInitiale,
  nouvelleÉvaluationCarbone,
  technologie,
}: PlainType<ValueType>): ValueType => {
  return {
    évaluationCarboneInitiale,
    nouvelleÉvaluationCarbone,
    technologie,
    estDégradée() {
      if (technologie !== 'pv') {
        return false;
      }
      const multipleArrondi = 50;
      const nouvelleValeurArrondie = arrondirAuMultipleDeNLePlusProche(
        this.nouvelleÉvaluationCarbone,
        multipleArrondi,
      );
      const valeurInitialeArrondie = arrondirAuMultipleDeNLePlusProche(
        this.évaluationCarboneInitiale,
        multipleArrondi,
      );
      // si la nouvelle valeur arrondie dépasse la valeur initiale arrondie, la note peut être dégradée
      return nouvelleValeurArrondie > valeurInitialeArrondie;
    },
  };
};

const arrondirAuMultipleDeNLePlusProche = (valeur: number, n: number) => Math.round(valeur / n) * n;
