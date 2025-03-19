import { ModèleRéponse } from '../modèleRéponseSignée';

export const modèleRéponsePuissanceFileName = 'puissance-modèle-réponse.docx';

export type ModèleRéponsePuissance = ModèleRéponse & {
  type: 'puissance';
  data: {
    puissanceInitiale?: string;
    nouvellePuissance: string;
    puissanceActuelle: string;
    referenceParagraphePuissance: string;
    contenuParagraphePuissance: string;

    enCopies: Array<string>;
  };
};
