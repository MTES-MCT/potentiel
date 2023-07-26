import { InvalidOperationError, NotFoundError } from '@potentiel/core-domain';

export class ProjetInconnuError extends NotFoundError {
  constructor() {
    super(`Le projet n'existe pas`);
  }
}

export class GestionnaireRéseauProjetDéjàDéclaréErreur extends InvalidOperationError {
  constructor() {
    super(`Un gestionnaire de réseau a déjà été déclaré pour ce projet`);
  }
}

export class TypeGarantiesFinancièresNonAcceptéErreur extends InvalidOperationError {
  constructor() {
    super(`Le type de garanties financières saisi n'est pas accepté`);
  }
}

export class DateConstitutionGarantiesFinancièreDansLeFuturErreur extends InvalidOperationError {
  constructor() {
    super('La date de constitution des garanties financières ne peut pas être une date future');
  }
}

export class DateÉchéanceGarantiesFinancièresNonAcceptéeErreur extends InvalidOperationError {
  constructor() {
    super(
      "Vous ne pouvez pas ajouter une date d'échéance pour le type de garanties financières renseigné",
    );
  }
}

export class ModificationGarantiesFinancièresNonAutoriséeErreur extends InvalidOperationError {
  constructor() {
    super('Vous ne pouvez pas modifier des données de garanties financières déjà validées');
  }
}
