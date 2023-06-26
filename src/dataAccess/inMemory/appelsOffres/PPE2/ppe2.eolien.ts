import { AppelOffre } from '@entities';

const eolienPPE2: AppelOffre = {
  id: 'PPE2 - Eolien',
  type: 'eolien',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie mécanique du vent implantées à terre',
  shortTitle: 'PPE2 - Eolien',
  dossierSuiviPar: 'tiphany.genin@developpement-durable.gouv.fr',
  launchDate: 'Août 2021',
  unitePuissance: 'MW',
  autoritéCompétenteDemandesDélai: 'dreal',
  tarifOuPrimeRetenue: 'le prix de référence T de l’électricité retenu',
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  paragraphePrixReference: '7',
  affichageParagrapheECS: false,
  paragrapheEngagementIPFPGPFC: '3.3.7, 4.3 et 6.5.2',
  renvoiEngagementIPFPGPFC: '3.3.7',
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.1',
  soumisAuxGarantiesFinancieres: 'à la candidature',
  paragrapheDelaiDerogatoire: '6.3',
  delaiRealisationEnMois: 36,
  delaiRealisationTexte: 'trente-six (36) mois',
  decoupageParTechnologie: false,
  paragrapheAttestationConformite: '6.5',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.2',
  paragrapheClauseCompetitivite: '2.11',
  afficherPhraseRegionImplantation: false,
  afficherValeurEvaluationCarbone: true,
  doitPouvoirChoisirCDCInitial: true,
  changementPuissance: {
    ratios: {
      min: 0.8,
      max: 1.2,
    },
  },
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.2',
      dispositions: `Le Candidat dont l’offre a été retenue réalise l’Installation dans les conditions du présent cahier des charges et conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.2).
Par exception, le Candidat est délié de cette obligation :
- en cas de retrait de l’autorisation environnementale par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés.
- en cas de non obtention ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la réalisation du projet.
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée.
Le Candidat peut également être délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite d’une demande dûment justifiée. Le Ministre peut accompagner son accord de conditions ou du prélèvement d’une part de la garantie financière. Ni l’accord du Ministre, ni les conditions imposées, ni le prélèvement de la garantie financière ne limitent la possibilité de recours de l’Etat aux sanctions du 8.2. 
`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.7',
      dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingts pourcents (80 %) et cent vingt pourcents (120 %) de la Puissance indiquée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications après l’Achèvement ou hors de cette fourchette ne sont pas autorisées.
 Par dérogation, les modifications à la baisse de la Puissance installée qui seraient imposées soit par une décision de l’Etat dans le cadre de la procédure d’autorisation, ou par une décision de justice concernant l’autorisation sont acceptées. Elles doivent faire l’objet d’une information au Préfet.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.3',
      dispositions: `
      Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- trente-six (36) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation  de conformité doit être transmise au cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la  durée de dépassement.
Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder la construction de l’installation ou sa mise en service. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires peuvent être accordés par le Préfet, à son appréciation, en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      certificateTemplate: 'ppe2.v1',
      noteThreshold: 0.68,
      cahierDesCharges: {
        référence: '2021/S 146-386083',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-eolien-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
      dossierSuiviPar: 'violaine.tarizzo@developpement-durable.gouv.fr',
    },
    {
      id: '2',
      title: 'deuxième',
      certificateTemplate: 'ppe2.v2',
      noteThreshold: 0.692142857142864,
      cahierDesCharges: {
        référence: '2022/S 035-088651',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-eolien-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
    },
    {
      id: '3',
      title: 'troisième',
      certificateTemplate: 'ppe2.v2',
      noteThreshold: 1.2,
      cahierDesCharges: {
        référence: '2022/S 214-614410',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-eolien-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
    },
    {
      id: '4',
      title: 'quatrième',
      certificateTemplate: 'ppe2.v2',
      noteThreshold: 13.8,
      cahierDesCharges: {
        référence: '2023/S 063-187148',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/2021-eolien-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 3, texte: 'trois' },
    },
  ],
  familles: [],
  cahiersDesChargesModifiésDisponibles: [
    {
      type: 'modifié',
      paruLe: '30/08/2022',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ppe-2-eolien-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      numéroGestionnaireRequis: true,
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.7',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingts pourcents (80 %) et cent vingt pourcents (120 %) de la Puissance indiquée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
    Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre, à condition qu’elle soit permise par l’autorisation environnementale de l’Installation, y compris si celle-ci a été modifiée.
    Les modifications après l’Achèvement ou hors de cette fourchette ne sont pas autorisées.
    Par dérogation, les modifications à la baisse de la Puissance installée qui seraient imposées soit par une décision de l’Etat dans le cadre de la procédure d’autorisation, ou par une décision de justice concernant l’autorisation sont acceptées. Elles doivent faire l’objet d’une information au Préfet.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.3',
          dispositions: `
          Le  Candidat  dont  l’offre  a  été  retenue  s’engage  à  ce  que  l’Achèvement  de  son  Installation  intervienne avant une limite définie par la date la plus tardive des deux dates suivantes : 
-trente-six (36) mois à compter de la Date de désignation. 
-deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date de la facture de solde à acquitter par  le producteur pour sa contribution au coût du raccordement. 
Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement. 
Des  dérogations  au  délai  d’Achèvement  sont  toutefois  possibles  dans  le  cas  où  des  contentieux  administratifs  effectués  à  l’encontre  de  toute autorisation  administrative  nécessaire  à  la  réalisation  du     projet     ont     pour     effet     de     retarder     la     construction     de     l’installation.     Dans     ce     cas,  un  délai  supplémentaire  égal  à  la  durée  entre  la  date  du  recours  initial  et  la  date  de  la  décision  définitive attestée par la décision ayant autorité de la chose jugée est alors accordé. 
 Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. 
Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.3 et au 7.1, pour la mise en service peuvent être accordés par le Préfet, à  son  appréciation,  en  cas  d’événement  imprévisible  à  la  Date  de  désignation  et  extérieur  au  Producteur, dûment justifié.
    `,
        },
      },
      délaiApplicable: {
        délaiEnMois: 18,
        intervaleDateMiseEnService: { min: new Date('2022-06-01'), max: new Date('2024-09-30') },
      },
    },
  ],
};

export { eolienPPE2 };
