import "@typespec/http";
import "@typespec/rest";
import "./shared.tsp";

using Http;
using Rest;

namespace PotentielApi;

model LaureatParameters {
  @path
  @segment("laureats")
  identifiantProjet: string;
}

model DossierRaccordementParameters {
  @path
  @segment("laureats")
  identifiantProjet: string;

  @path
  @segment("raccordements")
  reference: string;
}

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

model MiseEnServiceBody {
  @format("date")
  dateMiseEnService: string;
}

model ModifierDemandeCompleteBody {
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
@autoRoute
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
  @action("mise-en-service")
  @post
  transmettreMiseEnService(
    ...DossierRaccordementParameters,
    @body body: MiseEnServiceBody,
  ): {} | Error;

  /**
   * Transmet la date de mise en service pour un dossier de raccordement.
   *
   * _NB: un projet peut avoir plusieurs dossiers de raccordement._
   */
  @action("mise-en-service")
  @patch
  modifierMiseEnService(
    ...DossierRaccordementParameters,
    @body body: MergePatchCreateOrUpdate<MiseEnServiceBody>,
  ): {} | Error;

  /**
   * Transmet une demande complète de raccordement
   */
  @action("raccordements/demande-complete-raccordement")
  @post
  transmettreDemandeComplète(
    ...LaureatParameters,
    @body body: TransmettreDemandeCompleteRaccordementBody,
  ): {} | Error;

  /**
   * Modifie la demande complète de raccordement
   */
  @action("demande-complete-raccordement")
  @patch
  modifierDemandeComplète(
    ...DossierRaccordementParameters,
    @body body: MergePatchCreateOrUpdate<ModifierDemandeCompleteBody>,
  ): {} | Error;
}
