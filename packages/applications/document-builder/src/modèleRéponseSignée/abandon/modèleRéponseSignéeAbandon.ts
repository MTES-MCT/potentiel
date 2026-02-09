import { ModèleRéponse } from '../modèleRéponseSignée.js';

export const modèleRéponseAbandonFileName = 'abandon-modèle-réponse.docx';

export type ModèleRéponseAbandon = ModèleRéponse & {
  type: 'abandon';
  data: {
    dateDemande: string;
    justificationDemande: string;

    status: string;

    aprèsConfirmation: boolean;

    referenceParagrapheAbandon: string;
    contenuParagrapheAbandon: string;

    dateDemandeConfirmation: string;
    dateConfirmation: string;

    enCopies: Array<string>;
  };
};
