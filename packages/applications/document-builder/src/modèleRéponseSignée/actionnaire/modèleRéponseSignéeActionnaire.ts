import { ModèleRéponse } from '../modèleRéponseSignée.js';

export const modèleRéponseActionnaireFileName = 'actionnaire-modèle-réponse.docx';

export type ModèleRéponseActionnaire = ModèleRéponse & {
  type: 'actionnaire';
  data: {
    dateDemande: string;
    justificationDemande: string;

    nouvelActionnaire: string;
    referenceParagrapheActionnaire: string;
    contenuParagrapheActionnaire: string;
    enCopies: Array<string>;
    estAccordé: boolean;
  };
};
