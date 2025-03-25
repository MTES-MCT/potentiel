import { ModèleRéponse } from '../modèleRéponseSignée';

export const modèleRéponseDélaiFileName = 'délai-modèle-réponse.docx';

// Ce type est basé sur la possibilité qu'une demande de délai
// soit exprimée en mois (jusqu'à 2022) ou en date.
// Dans le cas où le délai est en date, la réponse est également en date.
// Dans le cas où le délai est en nombre de mois, la réponse peut être exprimée en mois ou en date
export type DemandePrécédente = {
  demandePrecedente: 'yes';
  dateDepotDemandePrecedente: string;
  dateReponseDemandePrecedente: string;
  autreDelaiDemandePrecedenteAccorde: 'yes' | '';
} & (
  | {
      demandeEnDate: 'yes';
      demandeEnMois?: undefined;
      dateDemandePrecedenteDemandée: string;
      dateDemandePrecedenteAccordée: string;
    }
  | ({
      demandeEnDate?: undefined;
      demandeEnMois: 'yes';
      dureeDelaiDemandePrecedenteEnMois: string;
    } & (
      | {
          demandeEnMoisAccordéeEnDate: 'yes';
          dateDemandePrecedenteAccordée: string;
        }
      | {
          demandeEnMoisAccordéeEnDate?: undefined;
          delaiDemandePrecedenteAccordeEnMois: string;
        }
    ))
);

export type ModèleRéponseDélai = ModèleRéponse & {
  type: 'délai';
  data: {
    referenceParagrapheAchevement: string;
    contenuParagrapheAchevement: string;
    dateLimiteAchevementInitiale: string;
    dateLimiteAchevementActuelle: string;
    dateAchèvementDemandée: string;

    enCopies: Array<string>;
  } & ({ demandePrecedente: '' } | ({ demandePrecedente: 'yes' } & DemandePrécédente));
};
