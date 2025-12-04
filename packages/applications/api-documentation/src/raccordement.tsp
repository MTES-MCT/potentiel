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
  nomProjet: string;
  identifiantProjet: string;
  appelOffre: string;
  periode: string;
  famille: string;

  @encodedName("application/json", "numeroCRE")
  numeroCre: string;

  commune: string;
  codePostal: string;
  referenceDossier: string;

  @encodedName("application/json", "statutDGEC")
  statutDgec: string;

  puissance: string;
  nomCandidat: string;
  sociétéMère: string;
  emailContact: string;

  /** Adresse complète du site de production */
  siteProduction: string;

  /** La date où le projet a été notifié */
  dateNotification: plainDate;
}

model TransmettreDateMiseEnServiceBody {
  dateMiseEnService: plainDate;
}

model ModifierReferenceBody {
  @minLength(1)
  nouvelleReference: string;
}

model TransmettreDemandeCompleteRaccordementBody {
  @minLength(1)
  reference: string;

  dateAccuseReception: plainDate;
}

@tag("Raccordement")
interface Raccordement {
  /**
   * Récupère la liste des dossiers de raccordement.
   */
  @route("/reseaux/raccordements")
  @get
  lister(
    @query
    page?: uint16,

    @doc("Ne lister que les dossier de raccordement avec, ou sans, date de mise en service.")
    @query
    avecDateMiseEnService?: boolean,
  ): ListResult<DossierRaccordement> | Error;

  @route("/reseaux/raccordements/manquants")
  @get
  listerManquants(
    @query
    page?: uint16,
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

  @route("/laureats/{identifiantProjet}/raccordements/demande-complete-raccordement:transmettre")
  @post
  transmettreDemandeComplète(
    @path
    identifiantProjet: string,

    @body body: TransmettreDemandeCompleteRaccordementBody,
  ): {} | Error;
}
