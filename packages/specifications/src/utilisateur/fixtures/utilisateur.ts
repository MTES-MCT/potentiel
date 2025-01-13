import { faker } from '@faker-js/faker';

import { Email } from '@potentiel-domain/common';

export interface Utilisateur {
  id: string;
  email: string;
  nom: string;
}

export abstract class AbstractUtilisateur implements Utilisateur {
  #id!: string;

  get id(): string {
    return this.#id;
  }

  set id(value: string) {
    this.#id = value;
  }

  #email!: string;

  get email(): string {
    return this.#email;
  }

  set email(value: string) {
    this.#email = value;
  }

  #nom!: string;

  get nom(): string {
    return this.#nom;
  }

  set nom(value: string) {
    this.#nom = value;
  }

  protected créer(partial?: Partial<Readonly<Omit<Utilisateur, 'role>'>>>): Readonly<Utilisateur> {
    const utilisateur: Utilisateur = {
      email: Email.convertirEnValueType(faker.internet.email()).formatter(),
      nom: faker.person.fullName(),
      id: faker.string.uuid(),
      ...partial,
    };

    this.#email = utilisateur.email;
    this.#nom = utilisateur.nom;
    this.#id = utilisateur.id;

    return utilisateur;
  }
}
