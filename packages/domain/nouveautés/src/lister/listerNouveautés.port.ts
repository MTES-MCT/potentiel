import type { Nouveauté } from '../nouveauté.type.js';

export type RécupérerNouveautésPort = ({
  limite,
}: {
  limite?: number;
}) => Promise<Array<Nouveauté>>;
