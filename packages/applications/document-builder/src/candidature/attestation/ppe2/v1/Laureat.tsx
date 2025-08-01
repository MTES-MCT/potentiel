import { Text, View } from '@react-pdf/renderer';
import React from 'react';

import { CahierDesCharges } from '@potentiel-domain/projet';

import { AttestationPPE2Options } from '../../AttestationCandidatureOptions';
import { formatNumber } from '../../helpers';
import { Footnote, makeAddFootnote } from '../../helpers/makeAddFootnotes';

type MakeLaureatProps = {
  project: AttestationPPE2Options;
  cahierDesCharges: CahierDesCharges.ValueType;
};

export const buildLauréat = ({ project, cahierDesCharges }: MakeLaureatProps) => {
  const { appelOffre, période } = project;
  const { soumisAuxGarantiesFinancieres } = appelOffre.garantiesFinancières || {};
  const { delaiDcrEnMois } = période;
  const footnotes: Array<Footnote> = [];
  const addFootNote = makeAddFootnote(footnotes);

  return {
    objet: `Désignation des lauréats de la ${période.title} période de l'appel d'offres ${période.cahierDesCharges.référence} ${appelOffre.title}`,
    content: (
      <>
        <Text
          style={{
            marginTop: 10,
            fontWeight: 'bold',
          }}
        >
          A la suite de l’instruction de votre offre par la Commission de régulation de l’énergie
          (CRE), j’ai le plaisir de vous annoncer que le projet susmentionné est désigné lauréat de
          la {période.title} tranche de l’appel d’offres visé en objet.
        </Text>

        <Text style={{ marginTop: 10 }}>
          Conformément à l’engagement contenu dans votre offre, je vous informe que{' '}
          {appelOffre.tarifOuPrimeRetenue} en application des dispositions du point{' '}
          {appelOffre.paragraphePrixReference} du cahier des charges est de{' '}
          {formatNumber(project.prixReference)} €/MWh.
          {appelOffre.affichageParagrapheECS && project.evaluationCarbone > 0
            ? ' La valeur de l’évaluation carbone des modules est de ' +
              formatNumber(project.evaluationCarbone) +
              ' kg eq CO2/kWc. '
            : ' '}
          {project.actionnariat === 'gouvernance-partagée' && (
            <Text>
              Vous vous êtes engagés{addFootNote(appelOffre.renvoiEngagementIPFPGPFC)} à la
              gouvernance partagée jusqu’à dix ans minimum après la Date d’Achèvement de
              l’Installation.
            </Text>
          )}
          {project.actionnariat === 'financement-collectif' && (
            <Text>
              Vous vous êtes engagés{addFootNote(appelOffre.renvoiEngagementIPFPGPFC)} au
              financement collectif jusqu’à trois ans minimum après la Date d’Achèvement de
              l’Installation.
            </Text>
          )}
        </Text>

        {project.engagementFournitureDePuissanceAlaPointe && (
          <Text style={{ marginTop: 10 }}>
            Lors de la réponse à l’appel d’offres, vous avez indiqué souhaiter un fonctionnement
            avec fourniture de puissance garantie à la pointe du soir et devez ainsi respecter les
            conditions de l’annexe 9 du cahier des charges relatives à la fourniture de puissance à
            la pointe.
          </Text>
        )}

        <Text style={{ marginTop: 10 }}>
          Par ailleurs, je vous rappelle les obligations suivantes du fait de cette désignation :
        </Text>
        <View style={{ paddingLeft: 20 }}>
          <Text
            style={{
              marginTop: 10,
            }}
          >
            - respecter l'ensemble des obligations et prescriptions de toute nature figurant au
            cahier des charges;
          </Text>
          <Text
            style={{
              marginTop: 10,
            }}
          >
            - si ce n’est déjà fait, déposer une demande complète de raccordement dans les{' '}
            {delaiDcrEnMois.texte} ({delaiDcrEnMois.valeur}) mois à compter de la présente
            notification
            {addFootNote(appelOffre.renvoiDemandeCompleteRaccordement)}
            {appelOffre.typeAppelOffre === 'eolien' &&
              ` ou dans les ${delaiDcrEnMois.texte} mois suivant la délivrance de l’autorisation environnementale pour les cas de candidature sans autorisation environnementale`}
            ;
          </Text>

          {soumisAuxGarantiesFinancieres &&
            appelOffre.garantiesFinancières.renvoiRetraitDesignationGarantieFinancieres && (
              <Text
                style={{
                  marginTop: 10,
                }}
              >
                - prévoir une durée de garantie financière d’exécution couvrant le projet jusqu’à 6
                mois après la date d’Achèvement de l’installation (date de fourniture de
                l’attestation de conformité selon les dispositions du chapitre{' '}
                {appelOffre.paragrapheAttestationConformite}) ou un renouvellement régulier afin
                d’assurer une telle couverture temporelle
                {addFootNote(
                  appelOffre.garantiesFinancières.renvoiRetraitDesignationGarantieFinancieres,
                )}
                ;
              </Text>
            )}

          {appelOffre.typeAppelOffre === 'innovation' && (
            <Text
              style={{
                marginTop: 10,
              }}
            >
              - mettre en oeuvre les éléments, dispositifs et systèmes innovants décrits dans le
              rapport de contribution à l’innovation et le cas échéant dans le mémoire technique sur
              la synergie avec l’usage agricole, remis lors du dépôt de l’offre
              {addFootNote('3.2.4 et 3.2.5')};
            </Text>
          )}

          <Text
            style={{
              marginTop: 10,
            }}
          >
            - sauf délais dérogatoires prévus au {appelOffre.paragrapheDelaiDerogatoire} du cahier
            des charges, achever l’installation dans un délai de{' '}
            {cahierDesCharges.getDélaiRéalisationEnMois()} mois à compter de la présente
            notification;
          </Text>

          <Text
            style={{
              marginTop: 10,
            }}
          >
            - fournir à EDF l’attestation de conformité de l’installation prévue au paragraphe{' '}
            {appelOffre.paragrapheAttestationConformite} du cahier des charges;
          </Text>

          {project.actionnariat === 'gouvernance-partagée' && (
            <Text
              style={{
                marginTop: 10,
              }}
            >
              - respecter les engagements pris conformément aux paragraphes{' '}
              {appelOffre.paragrapheEngagementIPFPGPFC} concernant la gouvernance partagée;
            </Text>
          )}

          {project.actionnariat === 'financement-collectif' && (
            <Text
              style={{
                marginTop: 10,
              }}
            >
              - respecter les engagements pris conformément aux paragraphes{' '}
              {appelOffre.paragrapheEngagementIPFPGPFC} concernant le financement collectif;
            </Text>
          )}
        </View>

        {appelOffre.afficherParagrapheInstallationMiseEnServiceModification && (
          <Text style={{ marginTop: 10 }}>
            Je vous rappelle également que l’installation mise en service doit être en tout point
            conforme à celle décrite dans le dossier de candidature. Toutefois, la modification de
            certains éléments de l’offre postérieurement à la désignation des lauréats est possible,
            selon les conditions et modalités précisées au {appelOffre.renvoiModification} du cahier
            des charges
            {appelOffre.affichageParagrapheECS && (
              <>
                {'. '}
                <Text
                  style={{
                    textDecoration: 'underline',
                  }}
                >
                  {appelOffre.typeAppelOffre === 'eolien'
                    ? ' Les changements conduisant à une remise en cause de l’autorisation mentionnée au 3.3.3 ne seront pas acceptés'
                    : ' Les changements conduisant à une diminution de la notation d’un ou plusieurs critères d’évaluations de l’offre, notamment par un bilan carbone moins performant, ne seront pas acceptés'}
                </Text>
              </>
            )}
            {appelOffre.typeAppelOffre === 'innovation' && (
              <>
                {'. '}
                <Text
                  style={{
                    textDecoration: 'underline',
                  }}
                >
                  Toute demande de modification substantielle de l’innovation sera notamment refusée{' '}
                  {addFootNote('5.4.4')}
                </Text>
              </>
            )}
            ;
          </Text>
        )}
      </>
    ),
    footnotes,
  };
};
