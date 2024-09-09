const FOOTNOTE_INDICES = [185, 178, 179, 186, 9824, 9827, 9829, 9830];

export type Footnote = {
  footnote: string;
  indice: number;
};

export const makeAddFootnote = (footnotes: Array<Footnote>) => (footnote: string) => {
  if (!footnote) {
    return '';
  }

  const indice = FOOTNOTE_INDICES[footnotes.length % FOOTNOTE_INDICES.length];
  footnotes.push({
    footnote,
    indice,
  });

  return String.fromCharCode(indice);
};
