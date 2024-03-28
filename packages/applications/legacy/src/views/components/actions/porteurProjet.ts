import { Routes } from '@potentiel-libraries/routes';
import { ProjectAppelOffre } from '../../../entities/appelOffre';
import ROUTES from '../../../routes';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../helpers/dataToValueTypes';

const porteurProjetActions = (project: {
  id: string;
  appelOffreId: string;
  periodeId: string;
  familleId: string;
  numeroCRE: string;
  appelOffre?: {
    typeAppelOffre: ProjectAppelOffre['typeAppelOffre'];
    changementProducteurPossibleAvantAchèvement: ProjectAppelOffre['changementProducteurPossibleAvantAchèvement'];
    unitePuissance: ProjectAppelOffre['unitePuissance'];
    periode: { type: ProjectAppelOffre['periode'] };
  };
  isClasse: boolean;
  isAbandoned: boolean;
  certificateFile?: {
    id: string;
    filename: string;
  };
  nomProjet: string;
  potentielIdentifier: string;
}) => {
  const canDownloadCertificate = !!project.certificateFile;

  if (project.isAbandoned) return [];

  if (!project.isClasse) {
    const actions: any[] = [];

    if (project.certificateFile) {
      actions.push({
        title: 'Télécharger mon attestation',
        link: ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
          id: project.id,
          certificateFileId: project.certificateFile.id,
          nomProjet: project.nomProjet,
          potentielIdentifier: project.potentielIdentifier,
        }),
        isDownload: true,
        disabled: !canDownloadCertificate,
      });
    }

    actions.push({
      title: 'Faire une demande de recours',
      link: ROUTES.DEPOSER_RECOURS(project.id),
    });

    return actions;
  }

  const actions: any[] = [];

  if (project.certificateFile) {
    actions.push({
      title: 'Télécharger mon attestation',
      link: ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
        id: project.id,
        certificateFileId: project.certificateFile.id,
        nomProjet: project.nomProjet,
        potentielIdentifier: project.potentielIdentifier,
      }),
      isDownload: true,
      disabled: !canDownloadCertificate,
    });
  }
  actions.push(
    ...[
      {
        title: 'Demander un délai',
        link: ROUTES.DEMANDER_DELAI(project.id),
      },
      ...(project.appelOffre?.changementProducteurPossibleAvantAchèvement
        ? [
            {
              title: 'Changer de producteur',
              link: ROUTES.GET_CHANGER_PRODUCTEUR(project.id),
            },
          ]
        : []),
      {
        title: 'Changer de fournisseur',
        link: ROUTES.CHANGER_FOURNISSEUR(project.id),
      },
      {
        title: "Changer d'actionnaire",
        link: ROUTES.CHANGER_ACTIONNAIRE(project.id),
      },
      {
        title:
          project.appelOffre?.typeAppelOffre === 'biométhane'
            ? `Changer la production annuelle prévisionnelle`
            : `Changer de puissance`,
        link: ROUTES.DEMANDER_CHANGEMENT_PUISSANCE(project.id),
      },
      {
        title: 'Demander un abandon',
        link: Routes.Abandon.demander(
          formatProjectDataToIdentifiantProjetValueType({
            appelOffreId: project.appelOffreId,
            periodeId: project.periodeId,
            familleId: project.familleId,
            numeroCRE: project.numeroCRE,
          }).formatter(),
        ),
      },
    ],
  );

  return actions;
};

export { porteurProjetActions };
