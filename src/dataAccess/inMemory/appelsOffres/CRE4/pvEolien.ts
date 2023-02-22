import { AppelOffre } from '@entities';

const garantieFinanciereEnMois = 36;
//autorité : DGEC

const pvEolien: AppelOffre = {
  id: 'PV - Eolien',
  type: 'eolien',
  title: `portant sur la réalisation de l'exploitation d'installations de production d'électricité à partir d'énergie solaire photovoltaïque ou élolienne situées en métropole continentale`,
  shortTitle: 'PV - Eolien',
  launchDate: 'Décembre 2017',
  unitePuissance: 'MW',
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  delaiRealisationEnMois: 24,
  decoupageParTechnologie: false,
  paragraphePrixReference: '7',
  paragrapheDelaiDerogatoire: '6.4',
  paragrapheAttestationConformite: '6.6',
  paragrapheEngagementIPFPGPFC: '3.3.7, 6.6',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  affichageParagrapheECS: true,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '5.3',
  renvoiEngagementIPFPGPFC: '3.3.7',
  paragrapheClauseCompetitivite: '',
  tarifOuPrimeRetenue: 'le prix de référence T de l’électricité retenu',
  tarifOuPrimeRetenueAlt: '',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  choisirNouveauCahierDesCharges: true,
  soumisAuxGarantiesFinancieres: 'après candidature',
  garantieFinanciereEnMois: garantieFinanciereEnMois,
  renvoiSoumisAuxGarantiesFinancieres: `doit être au minimum de ${garantieFinanciereEnMois} mois`,
  changementPuissance: { ratios: { min: 0.8, max: 1 } },
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue réalise l’Installation dans les conditions du présent cahier des charges et conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.4). 
Par exception, le Candidat est délié de cette obligation en cas de retrait de l’autorisation
d’urbanisme mentionnée au 3.2.4 ou de l’autorisation environnementale mentionnée au 3.3.5 par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Il en fait la demande au ministre chargé de l’énergie sans délai.

Le Candidat est également délié de cette obligation en cas de non obtention des autres autorisations administratives nécessaires à l’achèvement de l’Installation, de leur retrait par l’autorité compétente ou d’annulation de l’une de ces autorisations à la suite d’un contentieux. Il en fait la demande au ministre chargé de l’énergie sans délai.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: '5.4.4',
      dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance indiquée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.
Par dérogation, les modifications à la baisse de la Puissance installée qui seraient imposées soit par une décision de l’Etat dans le cadre de la procédure d’autorisation mentionnée au 3.3.3 pour la première période de candidature, ou par une décision de justice concernant l’autorisation mentionnée au 3.3.3 pour l’ensemble des périodes de candidature, sont acceptées. Elles doivent faire l’objet d’une information au Préfet.`,
    },
    texteChangementDActionnariat: {
      référenceParagraphe: '5.4.2',
      dispositions: `Les modifications de la structure du capital du Candidat avant la constitution des garanties financières prévues au 6.2 ne sont pas autorisées.
Les modifications de la structure du capital du Candidat après constitution des garanties financières sont réputées autorisées si le Candidat n’a pas joint à son offre la lettre d’engagement du 3.3.7. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois. Si le Candidat a joint à son offre la lettre d’engagement du 3.3.7, les modifications de la structure du capital du Candidat doivent être autorisées par le Préfet.`,
    },
    texteIdentitéDuProducteur: {
      référenceParagraphe: '2.5',
      dispositions: `Le Candidat doit être le Producteur de l’Installation de production. Il ne peut pas indiquer dans son offre qu’une autre société sera le Producteur de l’Installation de production au cas où le projet serait retenu.`,
    },
    texteChangementDeProducteur: {
      référenceParagraphe: '5.4.1',
      dispositions: `Aucun changement de Producteur n’est possible avant l’Achèvement.
En application de l’article R311-27-5 du code de l’énergie, les changements de Producteur postérieurement à l’Achèvement sont réputés autorisés. Ils doivent faire l’objet d’une information au Préfet et à EDF au minimum un (1) mois à l’avance.
En cas de changement de Producteur, le nouveau Producteur est tenu par le contenu de l’offre déposée ainsi que par les engagements et prescriptions du présent cahier des charges. En cas de changement de Producteur après signature du contrat, un avenant est conclu et les clauses et conditions du contrat s’imposent au nouveau Producteur pour la durée souscrite restante.`,
    },
    texteDélaisDAchèvement: {
      référenceParagraphe: '6.4',
      dispositions: `
      Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne dans un délai de vingt-quatre (24) mois à compter de la Date de désignation.
En cas de dépassement de ce délai, le prix de référence T proposé au C. du formulaire de candidature est diminué de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois ;
et
- l’Etat prélève une part de la garantie financière égale au montant total de la garantie divisé par trois cent soixante-cinq (365) et multiplié par le nombre de jours entiers de retard, dans la limite du montant total de la garantie diminué le cas échéant des mainlevées effectuées.
Sous réserve que la demande complète de raccordement de l’Installation ait été déposée auprès du gestionnaire de réseau compétent au plus tard deux mois après la Date de désignation et sous réserve que le producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais, les délais de transmission de l’attestation mentionnés ci-dessus sont prolongés lorsque la mise en service de l’Installation est retardée du fait des délais nécessaires à la réalisation des travaux de raccordement. Dans ce cas, le producteur transmet l’attestation de conformité dans un délai de 2 mois à compter de la fin des travaux de raccordement notifiée par tout document transmis par le gestionnaire du réseau compétent. En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement égal à la durée de dépassement.
Des délais supplémentaires, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié. Dans tous les cas, l’attribution des délais est soumise à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais, aucun délai ne pourra être accordé sans preuve de la prolongation de la garantie. Il appartient au Producteur d’informer EDF dans le cas d’obtention de délais, et ce dans les deux (2) semaines suivant la réception de la décision du ministre.
`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 238-494941',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Telecharger-le-cahier-des-charges-dans-sa-version-mise-en-ligne-le-18-juillet-2018',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.4.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-quinze pourcents et cent pourcents de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.`,
        },
      },
    },
  ],
  familles: [],
  cahiersDesChargesModifiésDisponibles: [
    {
      type: 'modifié',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre-4-pv-eolien-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      paruLe: '30/08/2022',
      numéroGestionnaireRequis: true,
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.4.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance indiquée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
Pour les projets dont soit l'achèvement, soit la mise en service est antérieur au 31 décembre 2024, cette augmentation de puissance peut être portée à 140% de la Puissance formulée dans l’offre, à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation (y compris si celle-ci a été modifiée) et que la Puissance modifiée soit inférieure à la limite de puissance de 18 MW mentionnée au 1.2.1.
Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.
Par dérogation, les modifications à la baisse de la Puissance installée qui seraient imposées soit par une décision de l’Etat dans le cadre de la procédure d’autorisation mentionnée au 3.3.3 pour la première période de candidature, ou par une décision de justice concernant l’autorisation mentionnée au 3.3.3 pour l’ensemble des périodes de candidature, sont acceptées. Elles doivent faire l’objet d’une information au Préfet.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `
Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
En cas de dépassement de ce délai, le prix de référence T0 proposé au C du formulaire de candidature est diminué de 0,25 euros/MWh par mois de retard pendant les 6 premiers mois, puis de 0,50 euros/MWh par mois de retard à partir du 7ème mois.
Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1, pour la mise en service, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
`,
        },
      },
      délaiApplicable: {
        délaiEnMois: 18,
        intervaleDateMiseEnService: { min: new Date('2022-09-01'), max: new Date('2024-12-31') },
      },
    },
  ],
};

export { pvEolien };
