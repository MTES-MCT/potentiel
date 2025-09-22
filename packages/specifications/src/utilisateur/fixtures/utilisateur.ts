import { faker } from '@faker-js/faker';

export interface Utilisateur<TRole extends string> {
  email: string;
  nom: string;
  role: TRole;
}

export abstract class AbstractUtilisateur<TRole extends string> implements Utilisateur<TRole> {
  #aÉtéCréé: boolean = false;

  get aÉtéCréé() {
    return this.#aÉtéCréé;
  }

  #role: TRole;
  get role(): TRole {
    return this.#role;
  }

  #email!: string;

  get email(): string {
    this.vérifierCréé();
    return this.#email;
  }

  set email(value: string) {
    this.#email = value;
  }

  #nom!: string;

  get nom(): string {
    this.vérifierCréé();
    return this.#nom;
  }

  set nom(value: string) {
    this.#nom = value;
  }

  constructor(role: TRole) {
    this.#role = role;
  }

  créer(
    partial?: Partial<Readonly<Omit<Utilisateur<TRole>, 'role>'>>>,
  ): Readonly<Utilisateur<TRole>> {
    const utilisateur: Utilisateur<TRole> = {
      role: this.role,
      email: faker.internet.email({ firstName: this.role }).toLowerCase(),
      nom: faker.person.fullName(),
      ...partial,
    };

    this.#email = utilisateur.email;
    this.#nom = utilisateur.nom;

    this.#aÉtéCréé = true;

    return utilisateur;
  }

  private vérifierCréé() {
    if (!this.aÉtéCréé) {
      throw new Error(`Utilisateur ${this.#role} non créé`);
    }
  }
}
