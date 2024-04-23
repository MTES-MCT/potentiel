import { Message, MessageHandler, mediator } from 'mediateur';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { CommonError, CommonPort } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { PériodeNonIdentifiéError } from '../périodeNonIdentifiéError.error';
import { ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery } from '../enAttente/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';

export type GénérerModèleMiseEnDemeureGarantiesFinancièresReadModel = {
  format: string;
  content: ReadableStream;
};

export type GénérerModèleMiseEnDemeureGarantiesFinancièresQuery = Message<
  'Document.Query.GénérerModèleMideEnDemeureGarantiesFinancières',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateCourrierValue: string;
  },
  GénérerModèleMiseEnDemeureGarantiesFinancièresReadModel
>;

export type BuildModèleMiseEnDemeureGarantiesFinancièresPort = (options: {
  data: {
    dreal: string;
    dateMiseEnDemeure: string;
    contactDreal: string;
    referenceProjet: string;
    titreAppelOffre: string;
    dateLancementAppelOffre: string;
    nomProjet: string;
    adresseCompleteProjet: string;
    puissanceProjet: string;
    unitePuissance: string;
    titrePeriode: string;
    dateNotification: string;
    paragrapheGF: string;
    garantieFinanciereEnMois: string;
    dateFinGarantieFinanciere: string;
    dateLimiteDepotGF: string;
    nomRepresentantLegal: string;
    adresseProjet: string;
    codePostalProjet: string;
    communeProjet: string;
    emailProjet: string;
  };
}) => Promise<ReadableStream>;

export type GénérerModèleMiseEnDemeureGarantiesFinancièresDependencies = {
  buildModèleMiseEnDemeureGarantiesFinancières: BuildModèleMiseEnDemeureGarantiesFinancièresPort;
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort;
};

export const registerGénérerModèleMiseEnDemeureGarantiesFinancièresQuery = ({
  buildModèleMiseEnDemeureGarantiesFinancières,
  récupérerRégionDreal,
}: GénérerModèleMiseEnDemeureGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<GénérerModèleMiseEnDemeureGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    dateCourrierValue,
  }) => {
    const régionDreal = await récupérerRégionDreal(identifiantUtilisateurValue);
    if (Option.isNone(régionDreal)) {
      throw new CommonError.RégionNonTrouvéeError();
    }

    const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
      type: 'Utilisateur.Query.ConsulterUtilisateur',
      data: {
        identifiantUtilisateur: identifiantUtilisateurValue,
      },
    });

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet: identifiantProjetValue,
      },
    });

    const appelOffres = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    const détailPériode = appelOffres.periodes.find(
      (période) => période.id === candidature.période,
    );

    if (!détailPériode) {
      throw new PériodeNonIdentifiéError();
    }

    const détailFamille = détailPériode?.familles.find((f) => f.id === candidature.famille);

    const projetAvecGarantiesFinancièresEnAttente =
      await mediator.send<ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
        data: { identifiantProjetValue },
      });

    const content = await buildModèleMiseEnDemeureGarantiesFinancières({
      data: {
        dreal: régionDreal.région,
        dateMiseEnDemeure: new Date(dateCourrierValue).toLocaleDateString('fr-FR'),
        contactDreal: utilisateur.email,
        referenceProjet: identifiantProjetValue,
        titreAppelOffre: `${détailPériode.cahierDesCharges.référence} ${appelOffres.title}`,
        dateLancementAppelOffre: new Date(appelOffres.launchDate).toLocaleDateString('fr-FR'),
        nomProjet: candidature.nom,
        adresseCompleteProjet: `${candidature.localité.adresse} ${candidature.localité.codePostal} ${candidature.localité.commune}`,
        puissanceProjet: candidature.puissance.toString(),
        unitePuissance: appelOffres.unitePuissance,
        titrePeriode: détailPériode.title,
        dateNotification: new Date(candidature.dateDésignation).toLocaleDateString('fr-FR'),
        paragrapheGF: appelOffres.renvoiRetraitDesignationGarantieFinancieres,
        garantieFinanciereEnMois:
          détailFamille && détailFamille?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? détailFamille.garantieFinanciereEnMois.toString()
            : appelOffres.soumisAuxGarantiesFinancieres === 'après candidature'
            ? appelOffres.garantieFinanciereEnMois.toString()
            : '!!! garantieFinanciereEnMois non disponible !!!',
        dateFinGarantieFinanciere:
          détailFamille && détailFamille?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? new Date(
                new Date(candidature.dateDésignation).setMonth(
                  new Date(candidature.dateDésignation).getMonth() +
                    détailFamille.garantieFinanciereEnMois,
                ),
              ).toLocaleDateString('fr-FR')
            : appelOffres.soumisAuxGarantiesFinancieres === 'après candidature'
            ? new Date(
                new Date(candidature.dateDésignation).setMonth(
                  new Date(candidature.dateDésignation).getMonth() +
                    appelOffres.garantieFinanciereEnMois,
                ),
              ).toLocaleDateString('fr-FR')
            : '!!! dateFinGarantieFinanciere non disponible !!!',
        dateLimiteDepotGF:
          projetAvecGarantiesFinancièresEnAttente.dateLimiteSoumission.date.toLocaleDateString(
            'fr-FR',
          ) || '',
        nomRepresentantLegal: candidature.candidat.nom,
        adresseProjet: candidature.candidat.adressePostale,
        codePostalProjet: candidature.localité.codePostal,
        communeProjet: candidature.localité.commune,
        emailProjet: candidature.candidat.contact,
      },
    });

    return {
      format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      content,
    };
  };
  mediator.register('Document.Query.GénérerModèleMideEnDemeureGarantiesFinancières', handler);
};
