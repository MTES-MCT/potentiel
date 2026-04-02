import { RepetitionChamp } from '../../graphql/client.js';
import { Champs } from '../../graphql/index.js';

export const normalizeLabel = (label: string) => label.trim().toLowerCase();

export const findRepetitionChamp = (champs: Champs, label: string): RepetitionChamp | undefined =>
  champs.find(
    (champ) =>
      champ.__typename === 'RepetitionChamp' &&
      normalizeLabel(champ.label) === normalizeLabel(label),
  ) as RepetitionChamp | undefined;

export const findTextChamp = (champs: Champs, label: string) =>
  champs.find(
    (champ) =>
      champ.__typename === 'TextChamp' && normalizeLabel(champ.label) === normalizeLabel(label),
  );

export const findMultipleDropDownListChamp = (champs: Champs, label: string) =>
  champs.find(
    (champ) =>
      champ.__typename === 'MultipleDropDownListChamp' &&
      normalizeLabel(champ.label) === normalizeLabel(label),
  );
