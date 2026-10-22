import type { Nouveauté } from '../nouveauté.type.js';

export type RécupérerNouveautésPort = () => Promise<Array<Nouveauté>>;
