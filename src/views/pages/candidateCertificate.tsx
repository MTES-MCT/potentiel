import React from 'react'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer'
import ReactPDF from '@react-pdf/renderer'
import { Project, AppelOffre, Periode } from '../../entities'
import moment from 'moment'
moment.locale('fr')

Font.register({
  family: 'Arial',
  fonts: [
    {
      src: process.env.BASE_URL + '/fonts/arial.ttf',
    },
    {
      src: process.env.BASE_URL + '/fonts/arial-bold.ttf',
      fontWeight: 'bold',
    },
  ],
})

const FOOTNOTE_INDICES = [185, 178, 179, 186, 9824, 9827, 9829, 9830]

const makeAddFootnote = (footNotes: Array<any>) => {
  return (footNote: string) => {
    const indice = FOOTNOTE_INDICES[footNotes.length % FOOTNOTE_INDICES.length]
    footNotes.push({
      footNote,
      indice,
    })

    return String.fromCharCode(indice)
  }
}

interface LaureatProps {
  project: Project
  appelOffre: AppelOffre
  periode: Periode
}
const Laureat = ({ project, appelOffre, periode }: LaureatProps) => {
  const objet = `Désignation des lauréats de la ${periode.title} période de l'appel offres ${appelOffre.title}`

  const requiresFinancialGuarantee = appelOffre.familles.find(
    (famille) => famille.id === project.familleId
  )?.requiresFinancialGuarantee

  const footNotes: Array<{ footNote: string; indice: number }> = []
  const addFootNote = makeAddFootnote(footNotes)

  const body = (
    <>
      <Text
        style={{
          fontSize: 11,
          textAlign: 'justify',
          marginTop: 10,
          fontWeight: 'bold',
        }}
      >
        Suite à l’instruction de votre offre par la Commission de régulation de
        l’énergie (CRE), j’ai le plaisir de vous annoncer que le projet
        susmentionné est désigné lauréat de la {periode.title} tranche de
        l’appel d’offres visé en objet.
      </Text>
      <Text style={{ fontSize: 11, textAlign: 'justify', marginTop: 10 }}>
        Conformément à l’engagement contenu dans votre offre, je vous informe
        que le prix de référence T de l’électricité retenu en application des
        dispositions du point {appelOffre.referencePriceParagraph} du cahier des
        charges est de {project.prixReference} €/MWh. La valeur de l’évaluation
        carbone des modules est de {project.evaluationCarbone} kg eq CO2/kWc.
        {project.isInvestissementParticipatif ? (
          <Text>
            En raison de votre engagement à l’investissement participatif, la
            valeur de ce prix de référence est majorée pendant toute la durée du
            contrat de 3 €/MWh sous réserve du respect de cet engagement
            {addFootNote(
              `Paragraphe ${appelOffre.ipFpEngagementParagraph} du cahier des charges`
            )}
            .
          </Text>
        ) : (
          <Text />
        )}
        {project.isFinancementParticipatif ? (
          <Text>
            En raison de votre engagement au financement participatif, la valeur
            de ce prix de référence est majorée pendant toute la durée du
            contrat de 1 €/MWh sous réserve du respect de cet engagement
            {addFootNote(
              `Paragraphe ${appelOffre.ipFpEngagementParagraph} du cahier des charges`
            )}
            .
          </Text>
        ) : (
          <Text />
        )}
      </Text>
      <Text style={{ fontSize: 11, textAlign: 'justify', marginTop: 10 }}>
        Par ailleurs, je vous rappelle les obligations suivantes du fait de
        cette désignation :
      </Text>
      <Text
        style={{
          fontSize: 11,
          textAlign: 'justify',
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        - respecter l'ensemble des obligations et prescriptions de toute nature
        figurant au cahier des charges.
      </Text>
      <Text
        style={{
          fontSize: 11,
          textAlign: 'justify',
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        - si ce n’est déjà fait, déposer une demande complète de raccordement
        dans les deux (2) mois à compter de la présente notification
        {addFootNote(
          `Paragraphe ${appelOffre.completePluginRequestParagraph} du cahier des charges`
        )}
        .
      </Text>
      {requiresFinancialGuarantee ? (
        <Text
          style={{
            fontSize: 11,
            marginTop: 10,
            textAlign: 'justify',
            marginLeft: 20,
          }}
        >
          - constituer une garantie d’exécution dans un délai de deux (2) mois à
          compter de la présente notification. Les candidats retenus n’ayant pas
          adressé au préfet de région du site d’implantation l’attestation de
          constitution de garantie financière dans le délai prévu feront l’objet
          d’une procédure de mise en demeure. En l’absence d’exécution dans un
          délai d’un mois après réception de la mise en demeure, le candidat
          pourra faire l’objet d’un retrait de la présente décision le désignant
          lauréat
          <Text>
            {addFootNote(
              `Paragraphe ${appelOffre.designationRemovalParagraph} du cahier des charges`
            )}
          </Text>
          .{' '}
          <Text style={{ textDecoration: 'underline' }}>
            La durée de la garantie doit être au minimum de 42 mois.
          </Text>
        </Text>
      ) : (
        <Text />
      )}
      <Text
        style={{
          fontSize: 11,
          textAlign: 'justify',
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        - sauf délais dérogatoires prévus au{' '}
        {appelOffre.derogatoryDelayParagraph} du cahier des charges, achever
        l’installation dans un délai de {appelOffre.monthsBeforeRealisation}{' '}
        mois à compter de la présente notification.
      </Text>
      <Text
        style={{
          fontSize: 11,
          textAlign: 'justify',
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        - fournir à EDF l’attestation de conformité de l’installation prévue au
        paragraphe {appelOffre.conformityParagraph} du cahier des charges.
      </Text>
      {project.isInvestissementParticipatif ? (
        <Text
          style={{
            fontSize: 11,
            textAlign: 'justify',
            marginTop: 10,
            marginLeft: 20,
          }}
        >
          - respecter les engagements pris conformément au(x) paragraphe(s){' '}
          {appelOffre.ipFpEngagementParagraph} concernant l’investissement
          participatif.
        </Text>
      ) : (
        <Text />
      )}
      {project.isFinancementParticipatif ? (
        <Text
          style={{
            fontSize: 11,
            textAlign: 'justify',
            marginTop: 10,
            marginLeft: 20,
          }}
        >
          - respecter les engagements pris conformément au(x) paragraphe(s){' '}
          {appelOffre.ipFpEngagementParagraph} concernant le financement
          participatif.
        </Text>
      ) : (
        <Text />
      )}
      <Text style={{ fontSize: 11, textAlign: 'justify', marginTop: 10 }}>
        Je vous rappelle également que l’installation mise en service doit être
        en tout point conforme à celle décrite dans le dossier de candidature et
        que toute modification du projet par rapport à l’offre déposée nécessite
        l’accord de l’autorité administrative.{' '}
        <Text
          style={{
            textDecoration: 'underline',
          }}
        >
          Les changements conduisant à une diminution de la notation d’un ou
          plusieurs critères d’évaluations de l’offre, notamment par un bilan
          carbone moins performant, ne seront pas acceptés.
        </Text>
      </Text>
    </>
  )

  // We have to jugle a bit with String.fromCharCode to have the actual indices and not literaly &sup1; or other
  // Also we replace the spaces in the footnote text with non-breaking spaces because of a bug in React-PDF that wraps way too early
  const footnotes = footNotes.map(({ footNote, indice }) => (
    <Text>
      {String.fromCharCode(indice)}{' '}
      {footNote.replace(/\s/gi, String.fromCharCode(160))}
    </Text>
  ))
  return { project, appelOffre, periode, objet, body, footnotes }
}

interface ElimineProps {
  project: Project
  appelOffre: AppelOffre
  periode: Periode
}
const Elimine = ({ project, appelOffre, periode }: ElimineProps) => {
  const objet = `Avis de rejet à l’issue de la ${periode.title} période de l'appel offres ${appelOffre.title}`

  const body = (
    <>
      <Text
        style={{
          fontSize: 11,
          textAlign: 'justify',
          marginTop: 10,
          fontWeight: 'bold',
        }}
      >
        {project.motifsElimination === 'Au-dessus de Pcible'
          ? `Suite à l’instruction par les services de la Commission de régulation de l’énergie, je suis au regret de vous informer que votre offre a été classée au-delà de la puissance offerte pour cette période de candidature dans la famille concernée. Votre offre a en effet obtenu une note de ${
              Math.round(project.note * 100) / 100
            } points alors que le classement des dossiers a fait apparaître que la sélection des offres jusqu’à la note de ${
              periode.noteThresholdByFamily?.find(
                (item) => item.familleId === project.familleId
              )?.noteThreshold || 'N/A'
            } points permettait de remplir les objectifs de volumes de l’appel d’offres dans cette famille. Par conséquent, cette offre n’a pas été retenue.`
          : project.motifsElimination.includes('Déjà lauréat')
          ? 'Suite à l’examen par les services de la Commission de régulation de l’énergie, je suis au regret de vous informer que votre offre a été retirée de l’instruction, ayant été désignée lauréate au cours d’un précédent appel d’offres. Par conséquent, cette offre n’a pas été retenue.'
          : `Suite à l’instruction par les services de la Commission de régulation de l’énergie, je suis au regret de vous informer que votre offre a été éliminée pour le motif suivant : «${project.motifsElimination}». Par conséquent, cette offre n’a pas été retenue.`}
      </Text>
      <Text style={{ fontSize: 11, textAlign: 'justify', marginTop: 10 }}>
        Vous avez la possibilité de contester la présente décision auprès du
        tribunal administratif territorialement compétent dans un délai de deux
        mois à compter de sa date de notification.
      </Text>
    </>
  )

  return { project, appelOffre, periode, objet, body }
}

// Create Document Component
interface CertificateProps {
  project: Project
  appelOffre: AppelOffre
  periode: Periode
  objet: string
  body: JSX.Element
  footnotes?: JSX.Element
}
const Certificate = ({
  project,
  appelOffre,
  periode,
  objet,
  body,
  footnotes,
}: CertificateProps) => {
  return (
    <Document>
      <Page
        size="A4"
        style={{
          backgroundColor: '#FFF',
          fontFamily: 'Arial',
          paddingTop: 50,
          paddingBottom: 50,
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 17,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Image
            style={{ width: 90, height: 53, marginHorizontal: 'auto' }}
            src={process.env.BASE_URL + '/images/Logo.png'}
          />
          <Text style={{ fontSize: 11, marginTop: 20 }}>
            MINISTÈRE DE LA TRANSITION ECOLOGIQUE ET SOLIDAIRE
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 150,
            right: 70,
            width: 200,
          }}
        >
          <Text style={{ fontSize: 11, marginBottom: 20 }}>
            Paris, le{' '}
            {moment(project.notifiedOn || Date.now()).format('D MMMM YYYY')}
          </Text>
          <Text style={{ fontSize: 11 }}>{project.nomRepresentantLegal}</Text>
          <Text style={{ fontSize: 11 }}>{project.nomCandidat}</Text>
          <Text style={{ fontSize: 11 }}>{project.email}</Text>
        </View>
        <View style={{ marginTop: 225, paddingHorizontal: 70 }}>
          <Text style={{ fontSize: 11, textAlign: 'justify' }}>
            Objet : {objet}
          </Text>
          <Text style={{ fontSize: 9, marginTop: 10 }}>
            Nos réf.: {appelOffre.shortTitle}/T{periode.id}-N°CRE{' '}
            {project.numeroCRE}
          </Text>
          <Text style={{ fontSize: 9, marginTop: 0 }}>
            Dossier suivi par : aopv.dgec@developpement-durable.gouv.fr
          </Text>
          <Text
            style={{
              fontSize: 11,
              marginTop: 30,
              marginBottom: 20,
              marginLeft: 20,
            }}
          >
            Madame, Monsieur,
          </Text>
          <Text style={{ fontSize: 11, textAlign: 'justify' }}>
            En application des dispositions de l’article L. 311-10 du code de
            l’énergie relatif à la procédure de mise en concurrence pour les
            installations de production d’électricité, le ministre chargé de
            l’énergie a lancé en {appelOffre.launchDate} l’appel d’offres cité
            en objet.
          </Text>
          <Text style={{ fontSize: 11, textAlign: 'justify', marginTop: 10 }}>
            En réponse à la {periode.title} tranche de cet appel d’offres, vous
            avez déposé dans la famille {project.familleId} le projet «{' '}
            {project.nomProjet} », situé {project.adresseProjet}{' '}
            {project.codePostalProjet} {project.communeProjet} d’une puissance
            de {project.puissance} {appelOffre.powerUnit}.
          </Text>
          {body}
          <Text style={{ fontSize: 11, textAlign: 'justify', marginTop: 30 }}>
            Je vous prie d’agréer, Madame, Monsieur, l’expression de mes
            salutations distinguées.
          </Text>
          <View
            style={{
              marginTop: 20,
              marginLeft: 200,
              position: 'relative',
            }}
          >
            <Text
              style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center' }}
            >
              L'adjoint au sous-directeur du système électrique et des énergies
              renouvelables,
            </Text>
            <Text style={{ fontSize: 11, textAlign: 'center', marginTop: 65 }}>
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
      </Page>
    </Document>
  )
}

interface MakeCertificateProps {
  destination: string
  project: Project
  appelOffre: AppelOffre
  periode: Periode
}
const makeCertificate = ({
  destination,
  project,
  appelOffre,
  periode,
}: MakeCertificateProps) => {
  let content
  if (project.classe === 'Classé') {
    content = Laureat({ project, appelOffre, periode })
  } else {
    content = Elimine({ project, appelOffre, periode })
  }
  return ReactPDF.render(<Certificate {...content} />, destination)
}

export { makeCertificate }
