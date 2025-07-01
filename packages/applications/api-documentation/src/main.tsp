import "@typespec/http";

using TypeSpec.Http;

@service({
  title: "Potentiel API",
})
namespace PotentielApi;

@error
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
  puissance: string;
  nomCandidat: string;
  societeMère: string;
  emailContact: string;
  siteProduction: string;
  dateNotification: string;
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
    @query page?: integer,
    @query avecDateMiseEnService?: boolean,
  ): DossierRaccordementListResult | Error;

  @route("api/v1/laureats/{identifiantProjet}/raccordements/{reference}/date-mise-en-service:transmettre")
  @post
  transmettreDateMiseEnService(
    @path identifiantProjet: string,
    @path reference: string,
    @body body: TransmettreDateMiseEnServiceBody,
  ): void | Error;

  @route("api/v1/laureats/{identifiantProjet}/raccordements/{reference}/reference:modifier")
  @post
  modifierReference(
    @path identifiantProjet: string,
    @path reference: string,
    @body body: TransmettreDateMiseEnServiceBody,
  ): void | Error;
}
