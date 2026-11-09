import "@typespec/http";
import "./shared.tsp";

using Http;
namespace PotentielApi;


namespace Achevement {

  model DossierRaccordementPourAchevement {
    /**
     * La référence du dossier de raccordement.
     * Un projet peut avoir plusieurs dossiers de raccordement (une ligne = un dossier)
     */
    reference: string;
  
    /**
     * La date de qualification de la Demande Complète de Raccordement.
     */
    @format("date")
    dateDemandeComplete?: string;
  
    /**
     * La date de mise en service du dossier de raccordement.
     */
    @format("date")
    dateMiseEnService?: string;
  }
  
  
  model ProjetPourAchevementV2 {
  
    /** Identifiant Projet Potentiel */
    identifiantProjet: string;
  
    /** Appel d'offres */
    appelOffre: string;
  
    /** Période */
    periode: string;
  
    /** Famille */
    famille: string;
  
    /** Nom projet */
    nomProjet: string;
  
    /** N°CRE */
    @encodedName("application/json", "numeroCRE")
    numeroCre: string;
  
    /** Candidat */
    nomCandidat: string;
  
    /** Date de notification lauréat */
    @format("date")
    dateNotification: string;
  
    /** Société mère
     * ⚠️ Correspond à l'actionnaire du lauréat (actionnaire.nom) - 🍀 Domaine actionnaire
     */
    societeMere: string;
  
    identification?: {
      /**
       * Numéro SIREN - 🍀 Domaine producteur
      **/
      siren?: Siren;
  
      /** 
      * Numéro SIRET - 🍀 Domaine producteur
      **/
      siret?: Siret;
    };
  
    /** 
     * Le(s) dossier(s) de raccordement rattaché(s) au projet - 🍀 Domaine raccordement
     **/
    dossiersRaccordement: Array<DossierRaccordementPourAchevement>;
  
    /** 
     * Puissance actuelle du projet (Puissance Lauréate (DGEC)), en MW - 🍀 Domaine puissance
     **/
    puissance: float32;
  
    /** 
     * Puissance du projet à la candidature (Puissance installée (MWc)), en MWc - 🍀 Domaine candidature
     **/
    puissanceInitiale: float32;
  
    /** 
     *  CDC actuel du projet - 🍀 Domaine lauréat
     **/
    cahierDesCharges: "initial" | "30/07/2021" | "30/08/2022" | "07/02/2023" | "30/07/2021-alternatif" | "30/08/2022-alternatif" | "07/02/2023-alternatif";
  
    /** 
     * Adresse - 🍀 Domaine lauréat
     **/
    siteDeProduction: Addresse;
  
    representantLegal?: {
      /** 
       * Nom et prénom du représentant légal 🍀 Domaine lauréat
       **/
      nom: string;
      /** 
       * Type de représentant légal 🍀 Domaine lauréat
       **/
      @encodedName("application/json", "type")
      typeRepresentantLegal: "personne-physique" | "personne-morale" | "collectivité" | "autre" | "inconnu"
    };
  
    /** 
     * Contact(s) : email - 🍀 Domaine Accès
     **/
    emailPorteurs: Array<string>;
  
    /** 
     * Type d'engagement - 🍀 Domaine Candidature
     */
    typeActionnariat?: "financement-collectif" | "gouvernance-partagée"| "financement-collectif-et-gouvernance-partagée" | "financement-participatif" | "investissement-participatif";
  
  /** 
   *  Prix de référence (€/MWh) 
   * 
   * 🍀 Domaine Candidature
   * */
  prix: float32;
  
  
    /** 
     * Délai accordé par les Autorités (mois) 
     * 
     * ⚠️ Demander pourquoi avoir besoin de cette donnée ? On peut proposer en alternatif : Array<{
     *  motif: string;
     *  nombreDeMois: uint8;
     * }>
     * 
     * 🍀 Domaine Délai
     * */
    delaiAccordeEnMois?: uint8;
  
    /** 
     * 
     * ⚠️ Demander pourquoi avoir besoin de cette donnée ? 
     * Pour un éliminé devenu lauréat suite à une demande de recous accordé, la date en question est la date de notification. 
     * 
     * Dates de recours - 🍀 Domaine Recours 
     **/
    recours?: {
      /** 
       * Date du recours initial  
       **/
      @format("date")
      dateDemande: string;
  
      /** 
       * Date de décision du recours 
       **/
      @format("date")
      dateAccord: string;
    };
  
    /** 
     * PP a choisi d'appliquer le coefficient K, afin d'indexer le prix sur l'inflation - 🍀 Domaine Candidature 
     **/
    coefficientKChoisi: boolean;
  
    /** 
     * Présence de trackers - 🍀 Domaine Détail candidature 
     **/
    presenceDeTrackers?: boolean;
  
    /** 
     * Gestionnaire réseau - 🍀 Domaine Réseau 
    **/
    gestionnaireReseau?: {
      raisonSociale: string;
      /**
        * L'identifiant du gestionnaire de réseau gérant le raccordement du projet.
        * Tous les dossiers d'un même projet sont gérés par le même gestionnaire de réseau.
      */
      @encodedName("application/json", "codeEIC")
      codeEic: string;
    };
  
    /** 
     * Typologies d'installation - 🍀 Domaine installation
     */
    typologieInstallation: Array<TypologieInstallation>;
  
    /** 
     * 
     * ⚠️ Demander pourquoi avoir besoin de cette donnée ? On peut proposer en alternatif : 
     *   statut: "actif" | "abandonné" | "achevé";
     *   achevementEnAttente: boolean;
     *  
     */
    statut: "actif" | "abandonné" | "achevé";
    achevementEnAttente: boolean;
  
    /** 
     * 
     * Technologie (dispositif de production) 
     * 
     * 🍀 Domaine Candidature
     * */
    technologie?: "pv" | "eolien" | "hydraulique";
  
    /** 
     * Coordonnées géodésiques WGS84
     * 
     * 🍀 Domaine Lauréat 
     * 
     */
    coordonneesGeodesiques?: {
      latitude: float32;
      longitude: float32;
    };
  
  
    /** 
    * Taux d'autoconsommation (AO autoconsommation)
    *
    * 🍀 Domaine Nature de l'exploitation 
    **/
    natureDeLExploitation?: {
      @encodedName("application/json", "type")
      typeNatureDeLExploitation: "vente-avec-injection-en-totalité" | "autoconsommation-individuelle" | "autoconsommation-collective" | "autoconsommation-individuelle-et-collective";
      @encodedName("application/json", "tauxPrevisionnelACI")
      tauxPrevisionnelAci?: uint16;
      @encodedName("application/json", "tauxPrevisionnelACC")
      tauxPrevisionnelAcc?: uint16;
    };
  
    /** 
     * Evaluation carbone simplifiée indiquée au C. du formulaire 
     * de candidature et arrondie (kg eq CO2/kWc)  
     * 
     * 🍀 Domaine Fournisseur 
    */
    evaluationCarboneSimplifiee?: float32;
  
    /** 
     * Type de terrain 
     * 
     * 🍀 Domaine Détail candidature 
     * 
    */
    typeDeTerrain?: "cas 1" | "cas 2" | "cas 2 bis" | "cas 3" | "cas 4" | "cas mixte";
  }
  
  
  @useAuth(BearerAuth)
  @tag("Achèvement V2")
  interface AchevementV2 {
    /**
     * Récupère les projets dont l'achèvement a été initié mais non confirmé (= date d'achèvement transmise) par le cocontractant.
     */
    @route("/achevements/en-attente")
    @get
    listerProjetsEnAttenteDAchevement(
      /**
       * L'index du dernier élément (`endPosition`) de la page précédente.
       */
      @query
      after?: uint16,
  
      @query
      appelOffre?: string,
  
      @query
      periode?: string,
  
      /**
       * Filtre optionnel pour ne récupérer que les projets dont l'achèvement a été initié après la date fournie.
       */
      @query
      depuis?: utcDateTime,
    ): ListResult<ProjetPourAchevementV2> | Error;
  
      /**
     * Récupère les informations d'un projet
     *
     * _NB: A terme, ce endpoint sera retiré_ et remplacé par /laureats/{identifiantProjet}/achevement/confirmer_ => Point à vérifier
     */
    @route("/laureats/{identifiantProjet}/achevement")
    @get
    recupererProjet(
      @path identifiantProjet: string,
    ): ProjetPourAchevementV2 | Error;
  }

}
