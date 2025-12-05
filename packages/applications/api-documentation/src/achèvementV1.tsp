import "@typespec/http";
import "./shared.tsp";

using Http;
namespace PotentielApi;

model ProjetAvecAchevementATransmettre {
  identifiantProjet: string;
  identifiantGestionnaireReseau: string;
  referenceDossierRaccordement: string;

  @format("date")
  dateDCR?: string;

  appelOffre: string;
  periode: string;
  codePostal: string;
  prix: float32;
  coefficientKChoisi: boolean;
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
    @query
    page?: uint16,

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
