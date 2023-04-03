export const demanderConfirmation = (event: React.MouseEvent<HTMLElement>, texte: string) => {
  confirm(texte) || event.preventDefault();
};

export type ConfirmationProp = {
  confirmation?: string;
};
