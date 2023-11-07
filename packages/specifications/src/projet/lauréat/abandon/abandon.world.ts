import { DateTime, IdentifiantUtilisateur } from '@potentiel-domain/common';

export class AbandonWord {
  #pièceJustificative!: { format: string; content: string };

  get pièceJustificative(): { format: string; content: string } {
    if (!this.#pièceJustificative) {
      throw new Error('pièceJustificative not initialized');
    }
    return this.#pièceJustificative;
  }

  set pièceJustificative(value: { format: string; content: string }) {
    this.#pièceJustificative = value;
  }

  #réponseSignée!: { format: string; content: string };

  get réponseSignée(): { format: string; content: string } {
    if (!this.#réponseSignée) {
      throw new Error('réponseSignée not initialized');
    }
    return this.#réponseSignée;
  }

  set réponseSignée(value: { format: string; content: string }) {
    this.#réponseSignée = value;
  }

  #dateDemande!: DateTime.ValueType;

  get dateDemande(): DateTime.ValueType {
    if (!this.#dateDemande) {
      throw new Error('dateDemandeExpected not initialized');
    }
    return this.#dateDemande;
  }

  set dateDemande(value: DateTime.ValueType) {
    this.#dateDemande = value;
  }

  #dateAnnulation!: DateTime.ValueType;

  get dateAnnulation(): DateTime.ValueType {
    if (!this.#dateAnnulation) {
      throw new Error('dateDemandeExpected not initialized');
    }
    return this.#dateAnnulation;
  }

  set dateAnnulation(value: DateTime.ValueType) {
    this.#dateAnnulation = value;
  }

  #dateRejet!: DateTime.ValueType;

  get dateRejet(): DateTime.ValueType {
    if (!this.#dateRejet) {
      throw new Error('dateRejet not initialized');
    }
    return this.#dateRejet;
  }

  set dateRejet(value: DateTime.ValueType) {
    this.#dateRejet = value;
  }

  #raison!: string;

  get raison(): string {
    if (!this.#raison) {
      throw new Error('raison not initialized');
    }
    return this.#raison;
  }

  set raison(value: string) {
    this.#raison = value;
  }

  #recandidature!: boolean;

  get recandidature(): boolean {
    if (!this.#recandidature) {
      throw new Error('recandidature not initialized');
    }
    return this.#recandidature;
  }

  set recandidature(value: boolean) {
    this.#recandidature = value;
  }

  #utilisateur!: IdentifiantUtilisateur.ValueType;

  get utilisateur(): IdentifiantUtilisateur.ValueType {
    if (!this.#utilisateur) {
      throw new Error('utilisateur not initialized');
    }
    return this.#utilisateur;
  }

  set utilisateur(value: IdentifiantUtilisateur.ValueType) {
    this.#utilisateur = value;
  }
}
