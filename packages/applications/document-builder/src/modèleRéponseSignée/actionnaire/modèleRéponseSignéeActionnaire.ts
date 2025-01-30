import { ModèleRéponse } from '../modèleRéponseSignée';

export const modèleRéponseActionnaireFileName = 'actionnaire-modèle-réponse.docx';

export type ModèleRéponseActionnaire = ModèleRéponse & {
  type: 'actionnaire';
  data: {
    nouvelActionnaire: string;
    referenceParagrapheActionnaire: string;
    contenuParagrapheActionnaire: string;
    enCopies: Array<string>;
    estAccordé: boolean;
  };
};
