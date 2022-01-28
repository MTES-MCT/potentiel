/* global JSX */
import { Document, Image, Page, Text, View } from '@react-pdf/renderer'
import React from 'react'
import { formatDate } from '../../../helpers/formatDate'
import { ProjectDataForCertificate } from '@modules/project/dtos'
import { formatNumber } from './formatNumber'

type CertificateProps = {
  project: ProjectDataForCertificate
  objet: string
  body: JSX.Element
  footnotes?: JSX.Element
}

export const Certificate = ({ project, objet, body, footnotes }: CertificateProps) => {
  const { appelOffre } = project
  const { periode } = appelOffre || {}

  return (
    <Document>
      <Page
        size="A4"
        style={{
          backgroundColor: '#FFF',
          fontFamily: 'Arial',
          padding: 40,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Image
            style={{ width: 165, height: 118 }}
            src={process.env.BASE_URL + '/images/Logo MTE.png'}
          />
          <Text style={{ fontSize: 12, fontWeight: 'bold', width: 200, paddingTop: 10 }}>
            Direction générale de l’énergie et du climat
          </Text>
        </View>

        <View
          style={{
            position: 'absolute',
            top: 240,
            right: 65,
            width: 245,
            textAlign: 'right',
          }}
        >
          <Text style={{ fontSize: 8, marginBottom: 60 }}>
            Paris, le {project.notifiedOn ? formatDate(project.notifiedOn, 'D MMMM YYYY') : '[N/A]'}
          </Text>
          <Text style={{ fontSize: 10 }}>{project.nomRepresentantLegal}</Text>
          <Text style={{ fontSize: 10 }}>{project.nomCandidat}</Text>
          <Text style={{ fontSize: 10 }}>{project.email}</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 265,
            left: 65,
          }}
        >
          <Text style={{ fontSize: 8 }}>Code Potentiel: {project.potentielId}</Text>
          <Text style={{ fontSize: 8 }}>Dossier suivi par : {appelOffre.dossierSuiviPar}</Text>
        </View>
        <View style={{ marginTop: 350, paddingHorizontal: 65, marginBottom: 50 }}>
          <Text style={{ fontSize: 10, textAlign: 'justify' }}>Objet : {objet}</Text>
          <Text
            style={{
              fontSize: 10,
              marginTop: 30,
              marginBottom: 20,
              marginLeft: 20,
            }}
          >
            Madame, Monsieur,
          </Text>
          <Text style={{ fontSize: 10, textAlign: 'justify' }}>
            En application des dispositions de l’article L. 311-10 du code de l’énergie relatif à la
            procédure de mise en concurrence pour les installations de production d’électricité, le
            ministre chargé de l’énergie a lancé en {appelOffre.launchDate} l’appel d’offres cité en
            objet.
          </Text>
          <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
            En réponse à la {periode.title} tranche de cet appel d’offres, vous avez déposé{' '}
            {appelOffre.familles.length && project.familleId
              ? `dans la famille ${project.familleId} `
              : ''}
            le projet « {project.nomProjet} », situé {project.adresseProjet}{' '}
            {project.codePostalProjet} {project.communeProjet} d’une puissance de{' '}
            {formatNumber(project.puissance, 1e6)} {appelOffre.unitePuissance}.
          </Text>
          {body}
          <View wrap={false}>
            <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 30 }}>
              Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.
            </Text>
            <View
              style={{
                marginTop: 20,
                marginLeft: 200,
                position: 'relative',
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>
                L’adjoint au sous-directeur du système électrique et des énergies renouvelables,
              </Text>
              <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 65 }}>
                Ghislain Ferran
              </Text>
              <Image
                style={{
                  position: 'absolute',
                  width: 130,
                  height: 105,
                  top: 25,
                  left: 70,
                }}
                src={process.env.BASE_URL + '/images/signature.png'}
              />
            </View>
          </View>

          {footnotes ? (
            <View
              style={{
                marginTop: 100,
                fontSize: 8,
              }}
            >
              {footnotes}
            </View>
          ) : (
            <View />
          )}
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 50,
            left: 65,
            width: 245,
            textAlign: 'left',
          }}
        >
          <Text style={{ fontSize: 7, lineHeight: 1.2 }} wrap={false}>
            92005 La Défense cedex – Tél : 33(0)1 40 81 98 21 – Fax : 33(0)1 40 81 93 97
          </Text>
        </View>
      </Page>
    </Document>
  )
}
