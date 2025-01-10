import { ModèleRéponse } from '../modèleRéponseSignée';

export const modèleRéponseAbandonFileName = 'abandon-modèle-réponse.docx';

export type ModèleRéponseAbandon = ModèleRéponse & {
  type: 'abandon';
  data: {
    status: string;

    aprèsConfirmation: boolean;

    referenceParagrapheAbandon: string;
    contenuParagrapheAbandon: string;

    dateDemandeConfirmation: string;
    dateConfirmation: string;

    enCopies: Array<string>;
  };
};
