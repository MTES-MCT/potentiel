export class VariableEnvironnementEmailSenderManquanteError extends Error {
  constructor(variable: string) {
    super(`La variable d'environnement suivante est manquante : ${variable}`);
  }
}

export class TemplateEmailInexistant extends Error {
  constructor(type: string) {
    super(`Le template de mail ${type} n'existe pas`);
  }
}
