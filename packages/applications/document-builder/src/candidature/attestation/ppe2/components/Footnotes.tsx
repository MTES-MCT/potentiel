import React from 'react';
import { View } from '@react-pdf/renderer';

import { Footnote as FootnoteType } from '../../helpers/makeAddFootnotes';

import { Footnote } from './Footnote';

export const Footnotes = ({ footnotes }: { footnotes: FootnoteType[] }) => {
  return (
    <View
      style={{
        marginTop: 100,
        fontSize: 8,
      }}
    >
      {footnotes.map((footnote, index) => (
        <Footnote {...footnote} key={`foot_note_${index}`} />
      ))}
    </View>
  );
};
