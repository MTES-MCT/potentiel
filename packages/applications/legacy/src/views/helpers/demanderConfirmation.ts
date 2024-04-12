export const demanderConfirmation = (
  event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLButtonElement>,
  texte: string,
) => {
  confirm(texte) || event.preventDefault();
};

export type ConfirmationProp = {
  confirmation?: string;
};
