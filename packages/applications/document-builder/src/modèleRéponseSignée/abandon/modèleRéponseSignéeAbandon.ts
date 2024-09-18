import { ModèleRéponse } from '../modèleRéponseSignée';

export const modèleRéponseAbandonFileName = 'garanties-financières-modèle-mise-en-demeure.docx';

export type ModèleRéponseAbandon = ModèleRéponse & {
  type: 'abandon';
  data: {
    aprèsConfirmation: boolean;

    referenceParagrapheAbandon: string;
    contenuParagrapheAbandon: string;

    dateDemandeConfirmation: string;
    dateConfirmation: string;

    enCopies: Array<string>;
  };
};
