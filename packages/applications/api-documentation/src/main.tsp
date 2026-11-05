import "@typespec/http";
import "./raccordement.tsp";
import "./achèvementV1.tsp";
import "./achèvementV2.tsp";

using Http;

@service(#{ title: "Potentiel API" })
@server("http://localhost:3000/api/v1", "Single server endpoint")
@useAuth(BearerAuth)
namespace PotentielApi;
