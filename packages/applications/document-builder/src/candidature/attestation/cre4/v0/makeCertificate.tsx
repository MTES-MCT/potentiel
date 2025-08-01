import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { formatDateForPdf } from '../../helpers/formatDateForPdf';
import { formatNumber } from '../../helpers';
import { AttestationCRE4Options } from '../../AttestationCandidatureOptions';
import { Footnote, makeAddFootnote } from '../../helpers/makeAddFootnotes';

const Laureat = (project: AttestationCRE4Options) => {
  const { appelOffre, période, famille } = project;
  const { delaiDcrEnMois } = période;

  const objet = `Désignation des lauréats de la ${période.title} période de l'appel d'offres ${période.cahierDesCharges.référence} ${appelOffre.title}`;

  const garantieFinanciereEnMois =
    famille?.garantiesFinancières.soumisAuxGarantiesFinancieres === 'après candidature'
      ? famille.garantiesFinancières.garantieFinanciereEnMois
      : appelOffre.garantiesFinancières.soumisAuxGarantiesFinancieres === 'après candidature'
        ? appelOffre.garantiesFinancières.garantieFinanciereEnMois
        : undefined;

  const footNotes: Array<Footnote> = [];
  const addFootNote = makeAddFootnote(footNotes);

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
        Suite à l’instruction de votre offre par la Commission de régulation de l’énergie (CRE),
        j’ai le plaisir de vous annoncer que le projet susmentionné est désigné lauréat de la{' '}
        {période.title} tranche de l’appel d’offres visé en objet.
      </Text>
      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
        Conformément à l’engagement contenu dans votre offre, je vous informe que{' '}
        {appelOffre.tarifOuPrimeRetenue} en application des dispositions du point{' '}
        {appelOffre.paragraphePrixReference} du cahier des charges est de{' '}
        {formatNumber(project.prixReference)} €/MWh.
        {appelOffre.afficherValeurEvaluationCarbone && project.evaluationCarbone > 0
          ? ' La valeur de l’évaluation carbone des modules est de ' +
            formatNumber(project.evaluationCarbone) +
            ' kg eq CO2/kWc. '
          : ''}
        {project.isInvestissementParticipatif ? (
          <Text>
            En raison de votre engagement à l’investissement participatif, la valeur de ce prix de
            référence est majorée pendant toute la durée du contrat de 3 €/MWh sous réserve du
            respect de cet engagement
            {addFootNote(appelOffre.renvoiEngagementIPFPGPFC)}.
          </Text>
        ) : (
          <Text />
        )}
        {project.isFinancementParticipatif ? (
          <Text>
            En raison de votre engagement au financement participatif, la valeur de ce prix de
            référence est majorée pendant toute la durée du contrat de 1 €/MWh sous réserve du
            respect de cet engagement
            {addFootNote(appelOffre.renvoiEngagementIPFPGPFC)}.
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
        des charges.
      </Text>
      <Text
        style={{
          fontSize: 10,
          textAlign: 'justify',
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        - si ce n’est déjà fait, déposer une demande complète de raccordement dans les{' '}
        {delaiDcrEnMois.texte} ({delaiDcrEnMois.valeur}) mois à compter de la présente notification
        {addFootNote(appelOffre.renvoiDemandeCompleteRaccordement)}.
      </Text>
      {garantieFinanciereEnMois ? (
        <Text
          style={{
            fontSize: 10,
            marginTop: 10,
            textAlign: 'justify',
            marginLeft: 20,
          }}
        >
          - constituer une garantie d’exécution dans un délai de deux (2) mois à compter de la
          présente notification. Les candidats retenus n’ayant pas adressé au préfet de région du
          site d’implantation l’attestation de constitution de garantie financière dans le délai
          prévu feront l’objet d’une procédure de mise en demeure. En l’absence d’exécution dans un
          délai d’un mois après réception de la mise en demeure, le candidat pourra faire l’objet
          d’un retrait de la présente décision le désignant lauréat
          <Text>
            {addFootNote(
              appelOffre.garantiesFinancières.renvoiRetraitDesignationGarantieFinancieres,
            )}
          </Text>
          .{' '}
          <Text style={{ textDecoration: 'underline' }}>
            La durée de la garantie doit être au minimum de {garantieFinanciereEnMois} mois.
          </Text>
        </Text>
      ) : (
        <Text />
      )}
      {appelOffre.typeAppelOffre === 'innovation' ? (
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
          avec l’usage agricole, remis lors du dépôt de l’offre
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
        charges, achever l’installation dans un délai de {appelOffre.delaiRealisationTexte} mois à
        compter de la présente notification.
      </Text>
      <Text
        style={{
          fontSize: 10,
          textAlign: 'justify',
          marginTop: 10,
          marginLeft: 20,
        }}
      >
        - fournir à EDF l’attestation de conformité de l’installation prévue au paragraphe{' '}
        {appelOffre.paragrapheAttestationConformite} du cahier des charges.
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
          - respecter les engagements pris conformément aux paragraphes{' '}
          {appelOffre.paragrapheEngagementIPFPGPFC} concernant l’investissement participatif.
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
          - respecter les engagements pris conformément aux paragraphes{' '}
          {appelOffre.paragrapheEngagementIPFPGPFC} concernant le financement participatif.
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
                Les changements conduisant à une diminution de la notation d’un ou plusieurs
                critères d’évaluations de l’offre, notamment par un bilan carbone moins performant,
                ne seront pas acceptés.{' '}
              </Text>
            ) : (
              <Text />
            )}
            {appelOffre.typeAppelOffre === 'innovation' ? (
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
  );

  // We have to jugle a bit with String.fromCharCode to have the actual indices and not literaly &sup1; or other
  // Also we replace the spaces in the footnote text with non-breaking spaces because of a bug in React-PDF that wraps way too early
  const footnotes = footNotes.map(({ footnote, indice }, index) => (
    <Text key={'foot_note_' + index}>
      {String.fromCharCode(indice)} Paragraphe {footnote.replace(/\s/gi, String.fromCharCode(160))}{' '}
      du cahier des charges
    </Text>
  ));
  return { project, appelOffre, période, objet, body, footnotes };
};

const Elimine = (project: AttestationCRE4Options) => {
  const { appelOffre, période } = project;

  const objet = `Avis de rejet à l’issue de la ${période.title} période de l'appel d'offres ${période.cahierDesCharges.référence} ${appelOffre.title}`;

  const body = (
    <>
      <Text
        style={{
          fontSize: 10,
          textAlign: 'justify',
          marginTop: 10,
        }}
      >
        Suite à l’instruction par les services de la Commission de régulation de l’énergie, je suis
        au regret de vous informer que votre offre a été éliminée pour le motif suivant : "
        {project.motifsElimination}". Par conséquent, cette offre n’a pas été retenue.
      </Text>
      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
        Vous avez la possibilité de contester la présente décision auprès du tribunal administratif
        territorialement compétent dans un délai de deux mois à compter de sa date de notification.
      </Text>
    </>
  );

  return { project, appelOffre, période, objet, body };
};

// Create Document Component
interface CertificateProps {
  project: AttestationCRE4Options;
  objet: string;
  body: JSX.Element;
  footnotes?: JSX.Element[];
  validateur: AppelOffre.Validateur;
  imagesRootPath: string;
}
const Certificate = ({
  project,
  objet,
  body,
  footnotes,
  validateur,
  imagesRootPath,
}: CertificateProps) => {
  const { appelOffre, période } = project;

  return (
    <Document>
      <Page
        size="A4"
        style={{
          backgroundColor: '#FFF',
          fontFamily: 'Arimo',
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
          <Image style={{ width: 145, height: 118 }} src={imagesRootPath + '/logo_MTES.png'} />
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
            Paris, le {formatDateForPdf(project.notifiedOn)}
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
          <Text style={{ fontSize: 8 }}>
            Dossier suivi par : aopv.dgec@developpement-durable.gouv.fr
          </Text>
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
            En réponse à la {période.title} tranche de cet appel d’offres, vous avez déposé dans la
            famille {project.famille?.id} le projet « {project.nomProjet} », situé{' '}
            {project.adresseProjet} {project.codePostalProjet} {project.communeProjet} d’une
            puissance de {formatNumber(project.puissance, 1e6)} {project.unitePuissance}.
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
              <Text style={{ fontSize: 10, marginTop: 30, textAlign: 'center' }}>
                {validateur.nomComplet}
              </Text>
              <Text
                style={{ fontSize: 10, fontWeight: 'bold', marginTop: 10, textAlign: 'center' }}
              >
                {validateur.fonction}
              </Text>
              <Text style={{ fontSize: 9, marginTop: 10, textAlign: 'left', fontStyle: 'italic' }}>
                Validé électroniquement par la plateforme https://potentiel.beta.gouv.fr et conforme
                à l'article L.212-2 du code des relations entre le public et l'administration.
              </Text>
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
            Hôtel de Roquelaure{'\n'}
            246 boulevard Saint-Germain – 75007 Paris{'\n'}
            Tél : 33(0)1 40 81 21 22{'\n'}
            www.ecologique-solidaire.gouv.fr
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const makeCertificate = (
  project: AttestationCRE4Options,
  validateur: AppelOffre.Validateur,
  imagesRootPath: string,
): React.JSX.Element => {
  return (
    <Certificate
      {...(project.isClasse ? Laureat(project) : Elimine(project))}
      validateur={validateur}
      imagesRootPath={imagesRootPath}
    />
  );
};

export { makeCertificate };
