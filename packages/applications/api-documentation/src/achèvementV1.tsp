import "@typespec/http";
import "./shared.tsp";

using Http;
namespace PotentielApi;

model ProjetAvecAchevementATransmettre {
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
   */
  referenceDossierRaccordement: string;

  /**
   * La date de qualification de la Demande Complète de Raccordement.
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
   * _NB: Dans un premier temps, ce endpoint retourne tous les projets lauréats non achevés et non abandonnés. A terme, il sera remplacé par /achevements/en-attente-confirmation_
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
  ): ListResult<ProjetAvecAchevementATransmettre> | Error;

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
