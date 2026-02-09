import { ModèleRéponse } from '../modèleRéponseSignée.js';

export const modèleRéponsePuissanceFileName = 'puissance-modèle-réponse.docx';

export type ModèleRéponsePuissance = ModèleRéponse & {
  type: 'puissance';
  data: {
    puissanceInitiale?: string;
    nouvellePuissance: string;
    puissanceActuelle: string;
    referenceParagraphePuissance: string;
    contenuParagraphePuissance: string;
    estAccordé: boolean;
    dateDemande: string;
    justificationDemande: string;

    enCopies: Array<string>;
  };
};
