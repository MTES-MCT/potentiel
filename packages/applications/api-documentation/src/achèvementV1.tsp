import "@typespec/http";
import "./shared.tsp";

using Http;
namespace PotentielApi;

namespace Achevement {
  union TypologieInstallation {
    "bâtiment.neuf",
    "bâtiment.existant-avec-rénovation-de-toiture",
    "bâtiment.existant-sans-rénovation-de-toiture",
    "bâtiment.serre",
    "bâtiment.serre-agrivoltaïque-pré-aper",
    "bâtiment.serre-agrivoltaïque-post-aper",
    "bâtiment.stabulation",
    "bâtiment.mixte",
    "bâtiment.non-précisé",
    "ombrière.parking",
    "ombrière.agrivoltaïque",
    "ombrière.agrivoltaïque-pré-aper",
    "ombrière.agrivoltaïque-post-aper",
    "ombrière.autre",
    "ombrière.mixte",
    "sol",
    "agrivoltaïque.culture",
    "agrivoltaïque.jachère-plus-de-5-ans",
    "agrivoltaïque.élevage",
    "agrivoltaïque.serre",
    "agrivoltaïque.non-précisé",
  }

  model ProjetPourAchevementV1 {
    identifiantProjet: string;
    appelOffre: string;
    periode: string;
    nomProjet: string;
    siteDeProduction: Addresse;

    /** La date où le projet a été notifié */
    @format("date")
    dateNotification: string;

    /**
     * L'identifiant du gestionnaire de réseau gérant le raccordement du projet.
     * Tous les dossiers d'un même projet sont gérés par le même gestionnaire de réseau.
     */
    identifiantGestionnaireReseau: string;

    /**
     * La référence du dossier de raccordement.
     * Un projet peut avoir plusieurs dossiers de raccordement (une ligne = un dossier)
     * TODO à déplacer dans un champs `raccordements: DossierRaccordement[]`
     */
    referenceDossierRaccordement: string;

    /**
     * La date de qualification de la Demande Complète de Raccordement.
     * TODO à déplacer dans un champs `raccordements: DossierRaccordement[]`
     */
    @format("date")
    @encodedName("application/json", "dateDCR")
    dateDcr?: string;

    /** Prix de vente, en € par MWh */
    prix: float32;

    /**
     * Indique si le porteur de projet a choisi d'appliquer le coefficient K, afin d'indexer le prix sur l'inflation
     */
    coefficientKChoisi: boolean;

    /** Puissance actuelle du projet, en MW */
    puissance: float32;

    /** Puissance du projet à la candidature, en MW */
    puissanceInitiale: float32;

    /** Présence de trackers */
    presenceDeTrackers?: boolean;

    /** Porteurs rattachés au projet */
    emailPorteurs: Array<string>;

    /** Typologies d'installation */
    typologieInstallation: Array<TypologieInstallation>;
  }

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
    numeroCRE: string;

    /** Candidat */
    nomCandidat: string;

    /** Date de notification lauréat */
    @format("date")
    dateNotification: string;

    /** Société mère
     * ⚠️ Correspond à l'actionnaire du lauréat (actionnaire.nom) - 🍀 Domaine actionnaire
     */
    societeMere: string;

    /**
     * Numéro SIREN - 🍀 Domaine producteur
    **/
    siren?: Siren;

    /** 
     * Numéro SIRET - 🍀 Domaine producteur
     **/
    siret?: Siret;

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
    cahierDesChargeschoisi: "initial" | "30/07/2021" | "30/08/2022" | "07/02/2023" | "30/07/2021-alternatif" | "30/08/2022-alternatif" | "07/02/2023-alternatif";

    /** 
     * Adresse - 🍀 Domaine lauréat
     **/
    siteDeProduction: Addresse;

    representLegal?: {
      /** 
       * Nom et prénom du représentant légal 🍀 Domaine lauréat
       **/
      nom: string;
      /** 
       * Type de représentant légal 🍀 Domaine lauréat
       **/
      type: "personne-physique" | "personne-morale" | "collectivité" | "autre" | "inconnu"
    };

    /** 
     * Contact(s) : email - 🍀 Domaine Accès
     **/
    emailPorteurs: Array<string>;

    //

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
     * 🍀 Domaine Délai
     * */
    delaiAccordeEnMois?: uint16;

    /** 
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
      identifiant: string;
    };

    /** 
     * Typologies d'installation - 🍀 Domaine installation
     */
    typologieInstallation: Array<TypologieInstallation>;

    /** 
     * 
     * Statut
     *  
     */
    statut: "achevement-en-attente";

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
      type: "vente-avec-injection-en-totalité" | "autoconsommation-individuelle" | "autoconsommation-collective" | "autoconsommation-individuelle-et-collective";
      tauxPrevisionnelACI?: uint16;
      tauxPrevisionnelACC?: uint16;
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
    typeDeTerrain?: "cas 1" | "cas 2" | "cas 3" | "cas 4" | "cas mixte";
  }

  model TransmettreDateAchevementBody {
    @format("date")
    dateAchevement: string;
  }

  @useAuth(BearerAuth)
  @tag("Achèvement V1")
  interface AchevementV1 {
    /**
     * Récupère les projets en attente d'achèvement
     *
     * _NB: Ce endpoint est déprécié et sera supprimé. Il ne retourne que les projets ayant un dossier de raccordement, une entréepar dossier de raccordement. Utiliser /achevements/en-attente_
     *
     * @deprecated
     */
    @route("/achevements/a-transmettre")
    @get
    listerProjetAvecAchevementATransmettre(
      /**
       * L'index du dernier élément (`endPosition`) de la page précédente.
       */
      @query
      after?: uint16,

      @query
      appelOffre?: string,

      @query
      periode?: string,
    ): ListResult<ProjetPourAchevementV1> | Error;

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
    récupérerProjet(
      @path identifiantProjet: string,
    ): ProjetPourAchevementV2 | Error;

    /**
     * Transmettre la date d'achèvement d'un projet
     *
     * _NB: A terme, ce endpoint sera retiré_ et remplacé par /laureats/{identifiantProjet}/achevement/confirmer_ => Point à vérifier
     */
    @route("/laureats/{identifiantProjet}/achevement/date-achevement")
    @post
    transmettreDateDAchevement(
      @path identifiantProjet: string,
      @body body: TransmettreDateAchevementBody,
    ): {} | Error;
  }
}
