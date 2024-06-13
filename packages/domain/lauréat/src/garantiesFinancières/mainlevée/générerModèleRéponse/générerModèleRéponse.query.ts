import { Message, MessageHandler, mediator } from 'mediateur';
import { CommonPort } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { ConsulterDemandeMainlevéeGarantiesFinancièresQuery } from '../consulter/consulterDemandeMainlevéeGarantiesFinancières.query';

export type GénérerModèleRéponseMainlevéeGarantiesFinancièresReadModel = {
  format: string;
  content: ReadableStream;
};

export type GénérerModèleRéponseMainlevéeGarantiesFinancièresQuery = Message<
  'Document.Query.GénérerModèleRéponseMainlevéeGarantiesFinancières',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateModèleRéponseValue: string;
  },
  Option.Type<GénérerModèleRéponseMainlevéeGarantiesFinancièresReadModel>
>;

export type BuildModèleRéponseMainlevéeGarantiesFinancièresPort = (options: {
  data: {
    dateModèleRéponse: string;
    mainlevée: {
      statut: string;
      motif: string;
    };
    dreal: {
      région: string;
      email: string;
    };
    projet: {
      nom: string;
      appelOffre: string;
      période: string;
      famille: string;
      numéroCRE: string;
      localité: {
        adresse: string;
        codePostal: string;
        commune: string;
      };
      candidat: {
        nom: string;
        email: string;
      };
    };
  };
}) => Promise<ReadableStream>;

export type GénérerModèleRéponseMainlevéeGarantiesFinancièresDependencies = {
  buildModèleRéponseMainlevéeGarantiesFinancièresPort: BuildModèleRéponseMainlevéeGarantiesFinancièresPort;
  récupérerRégionDreal: CommonPort.RécupérerRégionDrealPort;
};

export const registerGénérerModèleRéponseMainlevéeGarantiesFinancièresQuery = ({
  buildModèleRéponseMainlevéeGarantiesFinancièresPort,
  récupérerRégionDreal,
}: GénérerModèleRéponseMainlevéeGarantiesFinancièresDependencies) => {
  const handler: MessageHandler<GénérerModèleRéponseMainlevéeGarantiesFinancièresQuery> = async ({
    identifiantProjetValue,
    identifiantUtilisateurValue,
    dateModèleRéponseValue,
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

    const mainlevée = await mediator.send<ConsulterDemandeMainlevéeGarantiesFinancièresQuery>({
      type: 'Lauréat.GarantiesFinancières.Mainlevée.Query.Consulter',
      data: { identifiantProjetValue },
    });

    if (Option.isNone(mainlevée)) {
      return Option.none;
    }

    const content = await buildModèleRéponseMainlevéeGarantiesFinancièresPort({
      data: {
        dateModèleRéponse: dateModèleRéponseValue,
        mainlevée: {
          statut: mainlevée.statut.statut as string,
          motif: mainlevée.motif.motif as string,
        },
        dreal: {
          région: régionDreal.région,
          email: utilisateur.email,
        },
        projet: {
          nom: candidature.nom,
          appelOffre: candidature.appelOffre,
          période: candidature.période,
          famille: candidature.famille,
          numéroCRE: candidature.numéroCRE,
          localité: candidature.localité,
          candidat: {
            nom: candidature.candidat.nom,
            email: candidature.candidat.contact,
          },
        },
      },
    });

    return {
      format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      content,
    };
  };
  mediator.register('Document.Query.GénérerModèleRéponseMainlevéeGarantiesFinancières', handler);
};
