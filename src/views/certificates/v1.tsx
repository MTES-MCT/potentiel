/* global JSX */
import ReactPDF, { Document, Font, Image, Page, Text, View } from '@react-pdf/renderer'
import dotenv from 'dotenv'
import React from 'react'
import { errAsync, logger, Queue, ResultAsync } from '@core/utils'
import { formatDate } from '../../helpers/formatDate'
import { ProjectDataForCertificate } from '@modules/project/dtos'
import { IllegalProjectStateError } from '@modules/project/errors'
import { OtherError } from '@modules/shared'

dotenv.config()

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

const formatNumber = (n, precisionOverride?: number) => {
  const precision = precisionOverride || 100
  return (Math.round(n * precision) / precision).toString().replace('.', ',')
}

const FOOTNOTE_INDICES = [185, 178, 179, 186, 9824, 9827, 9829, 9830]

const makeAddFootnote = (footNotes: Array<any>) => {
  return (footNote: string) => {
    if (!footNote) return '' // ignore if there is no footnote

    const indice = FOOTNOTE_INDICES[footNotes.length % FOOTNOTE_INDICES.length]
    footNotes.push({
      footNote,
      indice,
    })

    return String.fromCharCode(indice)
  }
}

const Laureat = (project: ProjectDataForCertificate) => {
  const { appelOffre } = project
  const { periode } = appelOffre || {}
  const objet =
    'Désignation des lauréats de la ' +
    periode.title +
    " période de l'appel offres " +
    appelOffre.title

  const famille = appelOffre.familles.find((famille) => famille.id === project.familleId)
  const soumisAuxGarantiesFinancieres =
    appelOffre.id === 'Eolien' ||
    famille?.garantieFinanciereEnMois ||
    famille?.soumisAuxGarantiesFinancieres

  const footNotes: Array<{ footNote: string; indice: number }> = []
  const addFootNote = makeAddFootnote(footNotes)

  const body = (
    <>
      <Text
        style={{
          fontSize: 10,
          textAlign: 'justify',
          marginTop: 10,
          fontWeight: 'bold',
        }}
      >
        À la suite de l’instruction de votre offre par la Commission de régulation de l’énergie
        (CRE), j’ai le plaisir de vous annoncer que le projet susmentionné est désigné lauréat de la{' '}
        {periode.title} tranche de l’appel d’offres visé en objet.
      </Text>
      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
        Conformément à l’engagement contenu dans votre offre, je vous informe que{' '}
        {appelOffre.tarifOuPrimeRetenue} en application des dispositions du point{' '}
        {appelOffre.paragraphePrixReference} du cahier des charges est de{' '}
        {formatNumber(project.prixReference)} €/MWh.
        {appelOffre.affichageParagrapheECS && project.evaluationCarbone > 0
          ? ' La valeur de l’évaluation carbone des modules est de ' +
            formatNumber(project.evaluationCarbone) +
            ' kg eq CO2/kWc. '
          : ' '}
        {project.isInvestissementParticipatif ? (
          <Text>
            En raison de votre engagement à l’investissement participatif, la valeur de{' '}
            {appelOffre.tarifOuPrimeRetenueAlt} est majorée pendant toute la durée du contrat de 3
            €/MWh sous réserve du respect de cet engagement
            {addFootNote(appelOffre.renvoiEngagementIPFP)}.
          </Text>
        ) : (
          <Text />
        )}
        {project.isFinancementParticipatif ? (
          <Text>
            En raison de votre engagement au financement participatif, la valeur de{' '}
            {appelOffre.tarifOuPrimeRetenueAlt} est majorée pendant toute la durée du contrat de 1
            €/MWh sous réserve du respect de cet engagement
            {addFootNote(appelOffre.renvoiEngagementIPFP)}.
          </Text>
        ) : (
          <Text />
        )}
      </Text>
      {project.engagementFournitureDePuissanceAlaPointe ? (
        <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
          Lors de la réponse à l’appel d’offres, vous avez indiqué souhaiter un fonctionnement avec
          fourniture de puissance garantie à la pointe du soir et devez ainsi respecter les
          conditions de l’annexe 9 du cahier des charges relatives à la fourniture de puissance à la
          pointe.
        </Text>
      ) : (
        <Text />
      )}
      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
        Par ailleurs, je vous rappelle les obligations suivantes du fait de cette désignation :
      </Text>
      <Text
        style={{
          fontSize: 10,
          textAlign: 'justify',
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        - respecter l’ensemble des obligations et prescriptions de toute nature figurant au cahier
        des charges;
      </Text>
      <Text
        style={{
          fontSize: 10,
          textAlign: 'justify',
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        - si ce n’est déjà fait, déposer une demande complète de raccordement dans les deux (2) mois
        à compter de la présente notification
        {addFootNote(appelOffre.renvoiDemandeCompleteRaccordement)}
        {appelOffre.id === 'Eolien'
          ? ' ou dans les deux mois suivant la délivrance de l’autorisation environnementale pour les cas de candidature sans autorisation environnementale'
          : ''}
        ;
      </Text>
      {soumisAuxGarantiesFinancieres && appelOffre.renvoiSoumisAuxGarantiesFinancieres ? (
        <Text
          style={{
            fontSize: 10,
            marginTop: 10,
            textAlign: 'justify',
            marginLeft: 20,
          }}
        >
          - constituer une garantie {appelOffre.id === 'Eolien' ? 'bancaire ' : ''}
          d’exécution dans un délai de deux (2) mois à compter de la présente notification. Les
          candidats retenus n’ayant pas adressé au préfet de région du site d’implantation
          l’attestation de constitution de garantie financière dans le délai prévu feront l’objet
          d’une procédure de mise en demeure. En l’absence d’exécution dans un délai d’un mois après
          réception de la mise en demeure, le candidat pourra faire l’objet d’un retrait de la
          présente décision le désignant lauréat
          <Text>{addFootNote(appelOffre.renvoiRetraitDesignationGarantieFinancieres)}</Text>.{' '}
          <Text style={{ textDecoration: 'underline' }}>
            La durée de la garantie {appelOffre.renvoiSoumisAuxGarantiesFinancieres};
          </Text>
        </Text>
      ) : (
        <Text />
      )}
      {appelOffre.id === 'CRE4 - Innovation' ? (
        <Text
          style={{
            fontSize: 10,
            marginTop: 10,
            textAlign: 'justify',
            marginLeft: 20,
          }}
        >
          - mettre en oeuvre les éléments, dispositifs et systèmes innovants décrits dans le rapport
          de contribution à l’innovation et le cas échéant dans le mémoire technique sur la synergie
          avec l’usage agricole, remis lors du dépôt de l’offre;
          <Text>{addFootNote('3.2.4 et 3.2.5')}</Text>.
        </Text>
      ) : (
        <Text />
      )}
      <Text
        style={{
          fontSize: 10,
          textAlign: 'justify',
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        - sauf délais dérogatoires prévus au {appelOffre.paragrapheDelaiDerogatoire} du cahier des
        charges, achever l’installation dans un délai de {appelOffre.delaiRealisationTexte} à
        compter de la présente notification;
      </Text>
      <Text
        style={{
          fontSize: 10,
          textAlign: 'justify',
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        - fournir à EDF l’attestation de conformité de l’installation prévue au(x) paragraphe(s){' '}
        {appelOffre.paragrapheAttestationConformite} du cahier des charges
        {project.isInvestissementParticipatif || project.isFinancementParticipatif ? ';' : '.'}
      </Text>
      {project.isInvestissementParticipatif ? (
        <Text
          style={{
            fontSize: 10,
            textAlign: 'justify',
            marginTop: 10,
            marginLeft: 20,
          }}
        >
          - respecter les engagements pris conformément au(x) paragraphe(s){' '}
          {appelOffre.paragrapheEngagementIPFP} concernant l’investissement participatif.
        </Text>
      ) : (
        <Text />
      )}
      {project.isFinancementParticipatif ? (
        <Text
          style={{
            fontSize: 10,
            textAlign: 'justify',
            marginTop: 10,
            marginLeft: 20,
          }}
        >
          - respecter les engagements pris conformément au(x) paragraphe(s){' '}
          {appelOffre.paragrapheEngagementIPFP} concernant le financement participatif.
        </Text>
      ) : (
        <Text />
      )}
      {appelOffre.afficherParagrapheInstallationMiseEnServiceModification ? (
        <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
          Je vous rappelle également que l’installation mise en service doit être en tout point
          conforme à celle décrite dans le dossier de candidature. Toutefois, la modification de
          certains éléments de l’offre postérieurement à la désignation des lauréats est possible,
          selon les conditions et modalités précisées au {appelOffre.renvoiModification} du cahier
          des charges.{' '}
          <Text
            style={{
              textDecoration: 'underline',
            }}
          >
            {appelOffre.affichageParagrapheECS ? (
              <Text>
                {appelOffre.id === 'Eolien'
                  ? 'Les changements conduisant à une remise en cause de l’autorisation mentionnée au 3.3.3 ne seront pas acceptés'
                  : 'Les changements conduisant à une diminution de la notation d’un ou plusieurs critères d’évaluations de l’offre, notamment par un bilan carbone moins performant, ne seront pas acceptés.'}{' '}
              </Text>
            ) : (
              <Text />
            )}
            {appelOffre.id === 'CRE4 - Innovation' ? (
              <>
                Toute demande de modification substantielle de l’innovation sera notamment refusée
                <Text>{addFootNote('5.4.4')}</Text>.
              </>
            ) : (
              <Text />
            )}
          </Text>
        </Text>
      ) : (
        <Text />
      )}
    </>
  )

  // We have to jugle a bit with String.fromCharCode to have the actual indices and not literaly &sup1; or other
  // Also we replace the spaces in the footnote text with non-breaking spaces because of a bug in React-PDF that wraps way too early
  const footnotes = footNotes.map(({ footNote, indice }, index) => (
    <Text key={'foot_note_' + index}>
      {String.fromCharCode(indice)} Paragraphe(s){' '}
      {footNote.replace(/\s/gi, String.fromCharCode(160))} du cahier des charges
    </Text>
  ))
  return { project, appelOffre, periode, objet, body, footnotes }
}

const getNoteThreshold = (project: ProjectDataForCertificate) => {
  const periode = project.appelOffre.periode

  if (!periode.noteThresholdByFamily) {
    logger.error(
      `candidateCertificate: looking for noteThresholdByFamily for a period that has none. Periode Id : ${periode.id}`
    )
    return 'N/A'
  }

  if (project.territoireProjet && project.territoireProjet.length) {
    const note = periode.noteThresholdByFamily.find(
      (item) => item.familleId === project.familleId && item.territoire === project.territoireProjet
    )?.noteThreshold

    if (!note) {
      logger.error(
        `candidateCertificate: looking for noteThreshold for periode: ${periode.id}, famille: ${project.familleId} and territoire: ${project.territoireProjet} but could not find it`
      )
      return 'N/A'
    }

    return note
  }

  const note = periode.noteThresholdByFamily.find((item) => item.familleId === project.familleId)
    ?.noteThreshold

  if (!note) {
    logger.error(
      `candidateCertificate: looking for noteThreshold for periode: ${periode.id} and famille: ${project.familleId} but could not find it`
    )
    return 'N/A'
  }

  return note
}
const Elimine = (project: ProjectDataForCertificate) => {
  const { appelOffre } = project
  const { periode } = appelOffre || {}
  const objet =
    'Avis de rejet à l’issue de la ' +
    periode.title +
    " période de l'appel offres " +
    appelOffre.title

  const body = (
    <>
      <Text
        style={{
          fontSize: 10,
          textAlign: 'justify',
          marginTop: 10,
        }}
      >
        {project.motifsElimination === 'Au-dessus de Pcible'
          ? "À la suite de l'instruction par les services de la Commission de régulation de l’énergie, je suis au regret de vous informer que votre offre a été classée au-delà de la puissance offerte pour cette période de candidature" +
            (appelOffre.familles.length ? ' dans la famille concernée' : '') +
            '. Votre offre a en effet obtenu une note de ' +
            formatNumber(project.note) +
            " points alors qu'à la suite du classement des dossiers, il apparaît que le volume appelé" +
            (appelOffre.familles.length ? ' pour cette famille' : '') +
            (appelOffre.familles.length && appelOffre.afficherPhraseRegionImplantation
              ? ', et'
              : '') +
            (appelOffre.afficherPhraseRegionImplantation
              ? ' pour la région d’implantation du projet définis au 1.2.2 du cahier des charges'
              : '') +
            ' a été atteint avec les offres ayant des notes supérieures à ' +
            formatNumber(getNoteThreshold(project)) +
            ' points. Par conséquent, cette offre n’a pas été retenue.'
          : project.motifsElimination === 'Déjà lauréat - Non instruit'
          ? "À la suite de l'instruction par les services de la Commission de régulation de l’énergie, je suis au regret de vous informer que votre offre n'a pas été retenue, elle avait déjà été désignée lauréate au cours d'un précédent appel d'offres."
          : project.motifsElimination.includes('20%') &&
            project.motifsElimination.includes('compétitivité')
          ? "À la suite de l'instruction par les services de la Commission de régulation de l’énergie, je suis au regret de vous informer que votre offre a été classée au-delà de la puissance maximale que la Ministre a décidé de retenir afin de préserver la compétitivité de l’appel d’offres en application des dispositions du(des) paragraphe(s) " +
            appelOffre.paragrapheClauseCompetitivite +
            ' du cahier des charges. Ainsi, ' +
            (appelOffre.familles.length ? 'pour chaque famille,' : '') +
            ' seuls 80 % des projets les mieux notés ont été retenus. Votre offre a en effet obtenu une note de ' +
            formatNumber(project.note) +
            ' points alors que la sélection des offres s’est faite jusqu’à la note de ' +
            formatNumber(getNoteThreshold(project)) +
            ' points. Par conséquent, cette offre n’a pas été retenue.'
          : "À la suite de l'instruction par les services de la Commission de régulation de l’énergie, je suis au regret de vous informer que votre offre a été éliminée pour le motif suivant : « " +
            project.motifsElimination +
            ' ». Par conséquent, cette offre n’a pas été retenue.'}
      </Text>
      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
        Vous avez la possibilité de contester la présente décision auprès du tribunal administratif
        territorialement compétent dans un délai de deux mois à compter de sa date de notification.
      </Text>
    </>
  )

  return { project, appelOffre, periode, objet, body }
}

// Create Document Component
interface CertificateProps {
  project: ProjectDataForCertificate
  objet: string
  body: JSX.Element
  footnotes?: JSX.Element
}
const Certificate = ({ project, objet, body, footnotes }: CertificateProps) => {
  const { appelOffre } = project
  const { periode } = appelOffre || {}

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
            top: 70,
            left: 63,
          }}
        >
          <Image
            style={{ width: 165, height: 118 }}
            src={process.env.BASE_URL + '/images/Logo MTE.png'}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            top: 98,
            right: 65,
            width: 250,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'right' }}>
            Direction générale de l’énergie et du climat
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'right' }}>
            Direction de l’énergie
          </Text>
          <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>
            Sous-direction du système électrique
          </Text>
          <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>
            et des énergies renouvelables
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

const queue = new Queue()

/* global NodeJS */
const makeCertificate = (
  project: ProjectDataForCertificate
): ResultAsync<NodeJS.ReadableStream, IllegalProjectStateError | OtherError> => {
  const { appelOffre } = project
  const { periode } = appelOffre || {}

  if (!appelOffre || !periode) {
    return errAsync(
      new IllegalProjectStateError({ appelOffre: 'appelOffre et/ou periode manquantes' })
    )
  }

  let content

  if (project.isClasse) {
    content = Laureat(project)
  } else {
    content = Elimine(project)
  }

  const ticket = queue.push(() => ReactPDF.renderToStream(<Certificate {...content} />))

  return ResultAsync.fromPromise(ticket, (e: any) => new OtherError(e.message))
}

export { makeCertificate }
