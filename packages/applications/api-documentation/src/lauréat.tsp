import "@typespec/http";
import "./shared.tsp";

using Http;
namespace PotentielApi;

model ProjetLaureat {
  identifiantProjet: string;
  nomProjet: string;
  appelOffre: string;
  periode: string;
  famille: string;
  numeroCRE: string;
  prix: string;
  puissance: string;
  unitePuissance: string;
}

interface Projet {
  /**
   * Récupère un lauréat par son identifiant projet
   */
  @route("/laureats/{identifiantProjet}")
  @get
  get(@path identifiantProjet: string): ProjetLaureat | Error;

  /**
   * Récupère un lauréat par sa référence de dossier de raccordement
   */
  @route("/laureats/par-reference-raccordement/{referenceRaccordement}")
  @get
  getParReference(@path referenceRaccordement: string): ProjetLaureat | Error;
}
