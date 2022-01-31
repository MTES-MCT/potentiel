import { Text } from '@react-pdf/renderer'
import React from 'react'
import { ProjectDataForCertificate } from '@modules/project/dtos'
import { formatNumber } from '../helpers/formatNumber'
import { estSoumisAuxGFs } from '../helpers/estSoumisAuxGFs'

type MakeLaureat = (project: ProjectDataForCertificate) => {
  content: React.ReactNode
  footnotes: Array<Footnote>
}

export const makeLaureat: MakeLaureat = (project) => {
  const { appelOffre } = project
  const { periode } = appelOffre || {}

  const soumisAuxGarantiesFinancieres = estSoumisAuxGFs(project)

  const footnotes: Array<Footnote> = []
  const addFootNote = makeAddFootnote(footnotes)

  const content = (
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

  return { content, footnotes }
}

const FOOTNOTE_INDICES = [185, 178, 179, 186, 9824, 9827, 9829, 9830]

type Footnote = {
  footnote: string
  indice: number
}

export const makeAddFootnote = (footnotes: Array<Footnote>) => (footnote: string) => {
  if (!footnote) {
    return ''
  }

  const indice = FOOTNOTE_INDICES[footnotes.length % FOOTNOTE_INDICES.length]
  footnotes.push({
    footnote,
    indice,
  })

  return String.fromCharCode(indice)
}
