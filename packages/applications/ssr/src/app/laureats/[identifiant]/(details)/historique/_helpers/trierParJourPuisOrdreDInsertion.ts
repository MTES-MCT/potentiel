/**
 *
 * Trie par date métier (jour calendaire), et laisse le tri stable retomber sur l'ordre
 * d'insertion réel (déjà correct puisque les évènements sont publiés dans l'ordre causal)
 * quand deux items tombent le même jour. Nécessaire car certaines dates métier (ex : date
 * de réponse signée d'un recours) peuvent être antidatées par un utilisateur, et se
 * retrouver, à l'instant près, avant un évènement pourtant survenu réellement avant elle.
 *
 */
type TrierParJourPuisOrdreDInsertionProps<T> = {
  items: ReadonlyArray<T>;
  dateOf: (item: T) => string;
};

export const trierParJourPuisOrdreDInsertion = <T>({
  items,
  dateOf,
}: TrierParJourPuisOrdreDInsertionProps<T>) =>
  [...items].sort((a, b) => {
    const dateA = new Date(dateOf(a));
    const dateB = new Date(dateOf(b));

    if (dateA.toISOString().slice(0, 10) === dateB.toISOString().slice(0, 10)) {
      return 0;
    }

    return dateA.getTime() - dateB.getTime();
  });
