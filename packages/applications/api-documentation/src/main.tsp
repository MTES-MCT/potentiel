import "@typespec/http";

using TypeSpec.Http;

@service({
  title: "Potentiel API",
})
namespace PotentielApi;

@error()
model Error {
  message: string;
}

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

model TransmettreDateMiseEnServiceBody {
  dateMiseEnService: string;
}

model ModifierReferenceBody {
  nouvelleReference: string;
}

@useAuth(BearerAuth)
interface Raccordement {
  @route("api/v1/reseaux/raccordements")
  @get
  list(
    @query() page?:integer, 
    @query avecDateMiseEnService?:boolean
  ): DossierRaccordementListResult | Error;

  @route("api/v1/laureat/{identifiantProjet}/raccordements/{reference}/date-mise-en-service:transmettre")
  @post
  transmettreDateMiseEnService(@path identifiantProjet: string, @path reference: string, @body body: TransmettreDateMiseEnServiceBody): void | Error;

  @route("api/v1/laureat/{identifiantProjet}/raccordements/{reference}/reference:modifier")
  @post
  modifierReference(@path identifiantProjet: string, @path reference: string, @body body: TransmettreDateMiseEnServiceBody): void | Error;
}