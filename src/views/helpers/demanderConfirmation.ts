export const demanderConfirmation = (event: React.MouseEvent<HTMLElement>, texte: string) => {
  confirm(texte) || event.preventDefault();
};
