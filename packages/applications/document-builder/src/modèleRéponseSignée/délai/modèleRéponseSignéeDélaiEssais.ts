import type { ModèleRéponse } from '../modèleRéponseSignée.js';

export const modèleRéponseDélaiEssaisFileName = 'délai-essais-modèle-réponse.docx';

export type ModèleRéponseDélaiEssais = ModèleRéponse & {
  type: 'délai-essais';
  data: {
    dateDemande: string;
    justificationDemande: string;

    enCopies: Array<string>;
    nombreDeMoisDemandé: number;
  };
};
