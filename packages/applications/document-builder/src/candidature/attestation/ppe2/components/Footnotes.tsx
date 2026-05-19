import { View } from '@react-pdf/renderer';

import type { Footnote as FootnoteType } from '../../helpers/makeAddFootnotes.js';
import { Footnote } from './Footnote.js';

export const Footnotes = ({ footnotes }: { footnotes: FootnoteType[] }) => {
  return (
    <View
      style={{
        marginTop: 100,
        fontSize: 8,
      }}
    >
      {footnotes.map((footnote) => (
        <Footnote {...footnote} key={footnote.indice} />
      ))}
    </View>
  );
};
