import "@typespec/http";
import "./shared.tsp";

using Http;
namespace PotentielApi;

namespace Achevement {
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
    typologieInstallation: Array<string>;
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
    identifiantProjet: string;
    appelOffre: string;
    periode: string;
    nomProjet: string;
    siteDeProduction: Addresse;

    /** La date où le projet a été notifié */
    @format("date")
    dateNotification: string;

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
    typologieInstallation: Array<string>;

    /**
     * L'identifiant du gestionnaire de réseau gérant le raccordement du projet.
     * Tous les dossiers d'un même projet sont gérés par le même gestionnaire de réseau.
     */
    identifiantGestionnaireReseau: string;

    /** Le(s) dossier(s) de raccordement rattaché(s) au projet */
    dossiersRaccordement: Array<DossierRaccordementPourAchevement>;
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
     * _NB: A terme, ce endpoint sera retiré_ et remplacé par /laureats/{identifiantProjet}/achevement/confirmer_
     */
    @route("/laureats/{identifiantProjet}/achevement")
    @get
    récupérerProjet(
      @path identifiantProjet: string,
    ): ProjetPourAchevementV2 | Error;

    /**
     * Transmettre la date d'achèvement d'un projet
     *
     * _NB: A terme, ce endpoint sera retiré_ et remplacé par /laureats/{identifiantProjet}/achevement/confirmer_
     */
    @route("/laureats/{identifiantProjet}/achevement/date-achevement")
    @post
    transmettreDateDAchevement(
      @path identifiantProjet: string,
      @body body: TransmettreDateAchevementBody,
    ): {} | Error;
  }
}
