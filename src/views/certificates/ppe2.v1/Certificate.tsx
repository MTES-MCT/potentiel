import { Document, Page, Text, View } from '@react-pdf/renderer'
import React from 'react'
import { ProjectDataForCertificate } from '@modules/project/dtos'
import { Header } from './components/Header'
import { Objet } from './components/Objet'
import { Introduction } from './components/Introduction'
import { Signature } from './components/Signature'
import { PageFooter } from './components/PageFooter'
import { Footnote, FootnoteProps } from './components/Footnote'
import { Validateur } from '..'

export type CertificateProps = {
  project: ProjectDataForCertificate
  content: React.ReactNode
  validateur: Validateur
} & (
  | {
      type: 'laureat'
      footnotes: Array<FootnoteProps>
    }
  | {
      type: 'elimine'
    }
)

export const Certificate = (props: CertificateProps) => {
  const { type, project, content, validateur } = props
  const footnotes = type === 'laureat' && props.footnotes

  return (
    <Document>
      <Page
        size="A4"
        style={{
          backgroundColor: '#FFF',
          fontFamily: 'Arimo',
          fontSize: 10,
          padding: 40,
          paddingBottom: 70,
        }}
      >
        <Header {...{ project }} />

        <View style={{ paddingLeft: 15 }}>
          <View style={{ textAlign: 'justify' }}>
            <Objet {...{ project }} />
            <Introduction {...{ project }} />

            {content}

            <View wrap={false}>
              <Text style={{ marginTop: 30 }}>
                Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations
                distinguées.
              </Text>

              <Signature validateur={validateur} />
            </View>
          </View>

          {footnotes && (
            <View
              style={{
                marginTop: 100,
                fontSize: 8,
              }}
            >
              {footnotes.map((footnote, index) => (
                <Footnote {...{ ...footnote }} key={`foot_note_${index}`} />
              ))}
            </View>
          )}
        </View>

        <PageFooter />
      </Page>
    </Document>
  )
}
