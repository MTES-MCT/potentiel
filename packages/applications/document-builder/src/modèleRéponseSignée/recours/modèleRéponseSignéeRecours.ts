import { ModèleRéponse } from '../modèleRéponseSignée';

export const modèleRéponseRecoursFileName = 'garanties-financières-modèle-mise-en-demeure.docx';

export type ModèleRéponseRecours = ModèleRéponse & {
  type: 'recours';
  data: {};
};
