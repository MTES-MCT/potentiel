import "@typespec/http";
import "./shared.tsp";

using Http;
namespace PotentielApi;

model ProjetEnAttenteAchevement {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  periode: string;
  famille: string;
  numeroCRE: string;
  referenceDossier: string;
  prix: string;
  dateDCR: string;
  attestationConformiteUrl: url;
}

model TransmettreDateAchevementBody {
  dateAchevement: string;
}

@tag("Achèvement V1")
interface AchevementV1 {
  /**
   * Récupère les projets en attente d'achèvement
   *
   * _NB: Dans un premier temps, ce endpoint retourne tous les projets lauréats non achevés et non abandonnés. A terme, il sera remplacé par /achevements/en-attente-confirmation_
   */
  @route("/achevements/en-attente")
  @get
  listerEnAttente(
    @query
    page?: uint16,
  ): ListResult<ProjetEnAttenteAchevement> | Error;

  /**
   * Transmettre la date d'achèvement d'un projet
   *
   * _NB: A terme, ce endpoint sera retiré_ et remplacé par /laureats/{identifiantProjet}/achevement/confirmer_
   */
  @route("/laureats/{identifiantProjet}/achevement/date-achevement:transmettre")
  @post
  transmettreDateDAchevement(
    @path identifiantProjet: string,
    @body body: TransmettreDateAchevementBody,
  ): {} | Error;
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
  ): ListResult<ProjetEnAttenteAchevement> | Error;

  /**
   * Confirmer l'achèvement d'un projet
   *
   * _NB: Dans un premier temps, ce endpoint n'est pas disponible. A terme, il remplacera /laureats/{identifiantProjet}/achevement/date-achevement:transmettre_
   */
  @route("/laureats/{identifiantProjet}/achevement/confirmer")
  @post
  confirmer(@path identifiantProjet: string): {} | Error;
}
