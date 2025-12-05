import "@typespec/http";
import "./shared.tsp";

using Http;
namespace PotentielApi;

model Document {
  url: string;
  dateDepot: utcDateTime;
}

model ProjetAvecAchevementAConfirmer {
  identifiantProjet: string;
  identifiantGestionnaireReseau: string;
  referenceDossierRaccordement: string;
  appelOffre: string;
  periode: string;
  codePostal: string;
  prix: float32;
  coefficientKChoisi: boolean;

  @format("date")
  dateDCR: string;

  @format("date")
  dateAchevement: string;

  attestationConformite: Document;
  evaluationCarboneSimplifiee: Document;
}

@useAuth(BearerAuth)
@tag("Achèvement V2")
interface AchevementV2 {
  /**
   * Liste les projets pour lesquels une attestation a été transmise, mais non encore confirmée.
   */
  @route("/achevements/en-attente-confirmation")
  @get
  listerEnAttenteConfirmation(
    @query
    page?: uint16,
  ): ListResult<ProjetAvecAchevementAConfirmer> | Error;

  /**
   * Confirmer l'achèvement d'un projet
   *
   * _NB: Dans un premier temps, ce endpoint n'est pas disponible. A terme, il remplacera /laureats/{identifiantProjet}/achevement/date-achevement:transmettre_
   */
  @route("/laureats/{identifiantProjet}/achevement/confirmer")
  @post
  confirmer(@path identifiantProjet: string): {} | Error;
}
