import { Text } from '@react-pdf/renderer'
import React from 'react'

export type FootnoteProps = {
  footnote: string
  indice: number
}

// We have to jugle a bit with String.fromCharCode to have the actual indices and not literaly &sup1; or other
// Also we replace the spaces in the footnote text with non-breaking spaces because of a bug in React-PDF that wraps way too early
export const Footnote = ({ footnote, indice }: FootnoteProps) => (
  <Text>
    {String.fromCharCode(indice)} Paragraphe(s) {footnote.replace(/\s/gi, String.fromCharCode(160))}{' '}
    du cahier des charges
  </Text>
)
