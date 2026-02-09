import { ModèleRéponse } from '../modèleRéponseSignée.js';

export const modèleRéponseDélaiFileName = 'délai-modèle-réponse.docx';

type DemandePrécédenteEnDate = {
  demandeEnDate: 'yes';
  demandeEnMois?: undefined;
  dateDemandePrecedenteDemandée: string;
  dateDemandePrecedenteAccordée: string;
};

type DemandePrécédenteEnMois = {
  demandeEnDate?: undefined;
  demandeEnMois: 'yes';
  dureeDelaiDemandePrecedenteEnMois: string;
} & (DemandePrécédenteEnMoisAccordéeAvecDate | DemandePrécédenteEnMoisAccordéeAvecMois);

type DemandePrécédenteEnMoisAccordéeAvecDate = {
  demandeEnMoisAccordéeEnDate: 'yes';
  dateDemandePrecedenteAccordée: string;
};

type DemandePrécédenteEnMoisAccordéeAvecMois = {
  demandeEnMoisAccordéeEnDate?: undefined;
  delaiDemandePrecedenteAccordeEnMois: string;
};

export type DemandePrécédente = {
  demandePrecedente: 'yes';
  dateDepotDemandePrecedente: string;
  dateReponseDemandePrecedente: string;
  autreDelaiDemandePrecedenteAccorde: 'yes' | '';
} & (DemandePrécédenteEnDate | DemandePrécédenteEnMois);

// Ce type est basé sur la possibilité qu'une demande de délai
// soit exprimée en mois (jusqu'à 2022) ou en date.
// Dans le cas où le délai est en date, la réponse est également en date.
// Dans le cas où le délai est en nombre de mois, la réponse peut être exprimée en mois ou en date
export type ModèleRéponseDélai = ModèleRéponse & {
  type: 'délai';
  data: {
    referenceParagrapheAchevement: string;
    contenuParagrapheAchevement: string;
    dateLimiteAchevementInitiale: string;
    dateLimiteAchevementActuelle: string;
    dateAchèvementDemandée: string;
    dateDemande: string;
    justificationDemande: string;

    enCopies: Array<string>;
    nombreDeMoisDemandé: number;
  } & ({ demandePrecedente: '' } | DemandePrécédente);
};
