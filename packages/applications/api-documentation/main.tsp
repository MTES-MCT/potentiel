import "@typespec/http";

using TypeSpec.Http;

@service({
  title: "Potentiel API",
})
namespace PotentielApi;

model RangeOptions {
  startPosition: integer;
  endPosition: integer;
}

model DossierRaccordement {
  nomProjet: string;
  identifiantProjet: string;
  appelOffre: string;
  periode: string;
  famille: string;
  numeroCRE: string;
  commune: string;
  codePostal: string;
  referenceDossier: string;
  statutDGEC: string;
}

model DossierRaccordementListResult {
  items: DossierRaccordement[];
  range: RangeOptions;
  total: integer;
}

@route("api/v1/reseaux/raccordements")
interface Raccordement {
  @get list(): DossierRaccordementListResult;
}