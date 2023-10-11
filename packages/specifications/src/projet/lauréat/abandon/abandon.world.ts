// export class AbandonWord {
//   #pièceJustificative!: { format: string; content: string };

//   get pièceJustificative(): { format: string; content: string } {
//     if (!this.#pièceJustificative) {
//       throw new Error('pièceJustificative not initialized');
//     }
//     return this.#pièceJustificative;
//   }

//   set pièceJustificative(value: { format: string; content: string }) {
//     this.#pièceJustificative = value;
//   }

//   #réponseSignée!: { format: string; content: string };

//   get réponseSignée(): { format: string; content: string } {
//     if (!this.#réponseSignée) {
//       throw new Error('réponseSignée not initialized');
//     }
//     return this.#réponseSignée;
//   }

//   set réponseSignée(value: { format: string; content: string }) {
//     this.#réponseSignée = value;
//   }

//   #dateAbandon!: Date;

//   get dateAbandon(): Date {
//     if (!this.#dateAbandon) {
//       throw new Error('dateAbandon not initialized');
//     }
//     return this.#dateAbandon;
//   }

//   set dateAbandon(value: Date) {
//     this.#dateAbandon = value;
//   }

//   #recandidature!: boolean;

//   get recandidature(): boolean {
//     if (!this.#recandidature) {
//       throw new Error('recandidature not initialized');
//     }
//     return this.#recandidature;
//   }

//   set recandidature(value: boolean) {
//     this.#recandidature = value;
//   }
// }
