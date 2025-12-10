import "@typespec/http";
import "./shared.tsp";

using Http;
namespace PotentielApi;

/**
 * Un dossier de raccordement représente un point d'injection d'un projet.
 *
 * _NB: un projet peut avoir plusieurs dossiers de raccordement._
 */
model DossierRaccordement {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  periode: string;
  famille: string;

  /** Adresse complète du site de production */
  siteDeProduction: Addresse;

  @encodedName("application/json", "numeroCRE")
  numeroCre: string;

  referenceDossier: string;
  statut: "actif" | "achevé";
  puissance: float32;
  unitePuissance: string;
  nomCandidat: string;
  societeMere: string;
  emailContact: string;

  /** La date où le projet a été notifié */
  @format("date")
  dateNotification: string;
}

model TransmettreDateMiseEnServiceBody {
  @format("date")
  dateMiseEnService: string;
}

model ModifierReferenceBody {
  @minLength(1)
  nouvelleReference: string;
}

model TransmettreDemandeCompleteRaccordementBody {
  @minLength(1)
  reference: string;

  @format("date")
  dateAccuseReception: string;
}

@tag("Raccordement")
interface Raccordement {
  /**
   * Récupère la liste des dossiers de raccordement.
   */
  @route("/reseaux/raccordements")
  @get
  lister(
    /**
     * L'index du dernier élément (`endPosition`) de la page précédente.
     */
    @query
    after?: uint16,

    @doc("Ne lister que les dossier de raccordement avec, ou sans, date de mise en service.")
    @query
    avecDateMiseEnService?: boolean,
  ): ListResult<DossierRaccordement> | Error;

  /**
   * Récupère la liste des projets sans dossier de raccordement.
   */
  @route("/reseaux/raccordements/manquants")
  @get
  listerManquants(
    /**
     * L'index du dernier élément (`endPosition`) de la page précédente.
     */
    @query
    after?: uint16,
  ): ListResult<DossierRaccordement> | Error;

  /**
   * Transmet la date de mise en service pour un dossier de raccordement.
   *
   * _NB: un projet peut avoir plusieurs dossiers de raccordement._
   */
  @route("/laureats/{identifiantProjet}/raccordements/{reference}/date-mise-en-service:transmettre")
  @post
  transmettreDateMiseEnService(
    @path identifiantProjet: string,
    @path reference: string,
    @body body: TransmettreDateMiseEnServiceBody,
  ): {} | Error;

  /**
   * Modifie la référence du dossier de raccordement
   */
  @route("/laureats/{identifiantProjet}/raccordements/{reference}/reference:modifier")
  @post
  modifierReference(
    @path identifiantProjet: string,
    @path reference: string,
    @body body: ModifierReferenceBody,
  ): {} | Error;

  /**
   * Transmet une demande complète de raccordement
   */
  @route("/laureats/{identifiantProjet}/raccordements/demande-complete-raccordement:transmettre")
  @post
  transmettreDemandeComplète(
    @path
    identifiantProjet: string,

    @body body: TransmettreDemandeCompleteRaccordementBody,
  ): {} | Error;
}
