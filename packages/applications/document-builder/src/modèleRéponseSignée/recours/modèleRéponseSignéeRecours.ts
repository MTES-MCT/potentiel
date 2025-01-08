import { ModèleRéponse } from '../modèleRéponseSignée';

export const modèleRéponseRecoursFileName = 'recours-modèle-réponse.docx';

export type ModèleRéponseRecours = ModèleRéponse & {
  type: 'recours';
  data: {
    status: string;
    prixReference: string;
    evaluationCarbone: string;
    isFinancementParticipatif: 'yes' | '';
    isInvestissementParticipatif: 'yes' | '';
    isEngagementParticipatif: 'yes' | '';
    engagementFournitureDePuissanceAlaPointe: 'yes' | '';
    nonInstruit: 'yes' | '';
    motifsElimination: string;
    tarifOuPrimeRetenue: string;
    paragraphePrixReference: string;
    affichageParagrapheECS: 'yes' | '';
    unitePuissance: string;
    eolien: 'yes' | '';
    AOInnovation: 'yes' | '';
    soumisGF: 'yes' | '';
    renvoiSoumisAuxGarantiesFinancieres: string;
    renvoiDemandeCompleteRaccordement: string;
    renvoiRetraitDesignationGarantieFinancieres: string;
    paragrapheDelaiDerogatoire: string;
    paragrapheAttestationConformite: string;
    paragrapheEngagementIPFPGPFC: string;
    renvoiModification: string;
    delaiRealisationTexte: string;
    isFinancementCollectif: 'yes' | '';
    isGouvernancePartagée: 'yes' | '';
  };
};
