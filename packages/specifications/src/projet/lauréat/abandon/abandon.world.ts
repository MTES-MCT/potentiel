import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

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

  #dateDemandeConfirmation!: DateTime.ValueType;

  get dateDemandeConfirmation(): DateTime.ValueType {
    if (!this.#dateDemandeConfirmation) {
      throw new Error('dateDemandeConfirmation not initialized');
    }
    return this.#dateDemandeConfirmation;
  }

  set dateDemandeConfirmation(value: DateTime.ValueType) {
    this.#dateDemandeConfirmation = value;
  }

  #dateConfirmation!: DateTime.ValueType;

  get dateConfirmation(): DateTime.ValueType {
    if (!this.#dateConfirmation) {
      throw new Error('dateConfirmation not initialized');
    }
    return this.#dateConfirmation;
  }

  set dateConfirmation(value: DateTime.ValueType) {
    this.#dateConfirmation = value;
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

  #dateAccord!: DateTime.ValueType;

  get dateAccord(): DateTime.ValueType {
    if (!this.#dateAccord) {
      throw new Error('dateAccord not initialized');
    }
    return this.#dateAccord;
  }

  set dateAccord(value: DateTime.ValueType) {
    this.#dateAccord = value;
  }

  #dateDemandePreuveRecandidature!: DateTime.ValueType;

  get dateDemandePreuveRecandidature(): DateTime.ValueType {
    if (!this.#dateDemandePreuveRecandidature) {
      throw new Error('dateDemandePreuveRecandidature not initialized');
    }
    return this.#dateDemandePreuveRecandidature;
  }

  set dateDemandePreuveRecandidature(value: DateTime.ValueType) {
    this.#dateDemandePreuveRecandidature = value;
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

  #preuveRecandidature!: IdentifiantProjet.ValueType;

  get preuveRecandidature(): IdentifiantProjet.ValueType {
    if (!this.#preuveRecandidature) {
      throw new Error('preuveRecandidature not initialized');
    }

    return this.#preuveRecandidature;
  }

  set preuveRecandidature(value: IdentifiantProjet.ValueType) {
    this.#preuveRecandidature = value;
  }

  #dateTransmissionPreuveRecandidature!: DateTime.ValueType;

  get dateTransmissionPreuveRecandidature(): DateTime.ValueType {
    if (!this.#dateTransmissionPreuveRecandidature) {
      throw new Error('dateTransmissionPreuveRecandidature not initialized');
    }

    return this.#dateTransmissionPreuveRecandidature;
  }

  set dateTransmissionPreuveRecandidature(value: DateTime.ValueType) {
    this.#dateTransmissionPreuveRecandidature = value;
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
