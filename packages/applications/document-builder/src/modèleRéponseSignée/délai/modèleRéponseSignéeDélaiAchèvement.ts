import type { ModèleRéponse } from '../modèleRéponseSignée.js';

export const modèleRéponseDélaiAchèvementFileName = 'délai-achèvement-modèle-réponse.docx';

// Ce type est basé sur la possibilité qu'une demande de délai
// soit exprimée en mois (jusqu'à 2022) ou en date.
// Dans le cas où le délai est en date, la réponse est également en date.
// Dans le cas où le délai est en nombre de mois, la réponse peut être exprimée en mois ou en date
export type ModèleRéponseDélaiAchèvement = ModèleRéponse & {
  type: 'délai-achèvement';
  data: {
    référenceParagrapheAchèvement: string;
    contenuParagrapheAchèvement: string;
    dateLimiteAchèvementInitiale: string;
    dateLimiteAchèvementActuelle: string;
    dateAchèvementDemandée: string;
    dateDemande: string;
    justificationDemande: string;
    enCopies: Array<string>;
    nombreDeMoisDemandé: number;
  };
};
