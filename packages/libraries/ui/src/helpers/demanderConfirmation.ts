/** @deprecated */
export const demanderConfirmation = (
  event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLButtonElement>,
  texte: string,
) => {
  confirm(texte) || event.preventDefault();
};

/** @deprecated */
export type ConfirmationProp = {
  confirmation?: string;
};
