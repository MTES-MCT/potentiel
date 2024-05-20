import { Message, MessageHandler, mediator } from 'mediateur';
import { CommonPort, DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
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
  Option.Type<GénérerModèleMiseEnDemeureGarantiesFinancièresReadModel>
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
      return Option.none;
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
      return Option.none;
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
        dateMiseEnDemeure: dateCourrierValue,
        contactDreal: utilisateur.email,
        referenceProjet: identifiantProjetValue,
        titreAppelOffre: `${détailPériode.cahierDesCharges.référence} ${appelOffres.title}`,
        dateLancementAppelOffre: appelOffres.launchDate,
        nomProjet: candidature.nom,
        adresseCompleteProjet: `${candidature.localité.adresse} ${candidature.localité.codePostal} ${candidature.localité.commune}`,
        puissanceProjet: candidature.puissance.toString(),
        unitePuissance: appelOffres.unitePuissance,
        titrePeriode: détailPériode.title,
        dateNotification: candidature.dateDésignation,
        paragrapheGF: appelOffres.renvoiRetraitDesignationGarantieFinancieres,
        garantieFinanciereEnMois:
          détailFamille && détailFamille?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? détailFamille.garantieFinanciereEnMois.toString()
            : appelOffres.soumisAuxGarantiesFinancieres === 'après candidature'
            ? appelOffres.garantieFinanciereEnMois.toString()
            : '!!! garantieFinanciereEnMois non disponible !!!',
        dateFinGarantieFinanciere:
          détailFamille && détailFamille?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? DateTime.convertirEnValueType(candidature.dateDésignation)
                .ajouterNombreDeMois(détailFamille.garantieFinanciereEnMois)
                .formatter()
            : appelOffres.soumisAuxGarantiesFinancieres === 'après candidature'
            ? DateTime.convertirEnValueType(candidature.dateDésignation)
                .ajouterNombreDeMois(appelOffres.garantieFinanciereEnMois)
                .formatter()
            : '!!! dateFinGarantieFinanciere non disponible !!!',
        dateLimiteDepotGF:
          (Option.isSome(projetAvecGarantiesFinancièresEnAttente) &&
            projetAvecGarantiesFinancièresEnAttente.dateLimiteSoumission.formatter()) ||
          '',
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
