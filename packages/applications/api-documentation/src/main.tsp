import "@typespec/http";
import "./raccordement.tsp";
import "./achèvement.tsp";
// import "./lauréat.tsp";

using Http;

@service(#{ title: "Potentiel API" })
@server("https://potentiel.beta.gouv.fr/api/v1", "Single server endpoint")
@useAuth(BearerAuth)
namespace PotentielApi;
