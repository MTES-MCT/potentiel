import asyncHandler from '../helpers/asyncHandler';
import moment from 'moment';
import os from 'os';
import path from 'path';
import sanitize from 'sanitize-filename';
import { userRepo } from '../../dataAccess';
import { fillDocxTemplate } from '../../helpers/fillDocxTemplate';
import { formatDate } from '../../helpers/formatDate';
import routes from '../../routes';
import { getUserProject } from '../../useCases';
import { ensureRole } from '../../config';
import { v1Router } from '../v1Router';
import { notFoundResponse, unauthorizedResponse } from '../helpers';
import { mediator } from 'mediateur';
import { ConsulterSuiviDépôtGarantiesFinancièresQuery } from '@potentiel/domain-views';
import { isNone } from '@potentiel/monads';

v1Router.get(
  routes.TELECHARGER_MODELE_MISE_EN_DEMEURE_DEFAUT_GF_INITIALE(),
  ensureRole('dreal'),
  asyncHandler(async (request, response) => {
    const { identifiantProjet } = request.params;

    if (!identifiantProjet) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
    }

    const projet = await getUserProject({ user: request.user, projectId: identifiantProjet });

    if (!projet) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
    }

    const {
      appelOffreId,
      periodeId,
      familleId,
      nomProjet,
      adresseProjet,
      codePostalProjet,
      communeProjet,
      regionProjet,
      numeroCRE,
      appelOffre: appelOffreProjet,
      puissance,
      notifiedOn,
      nomRepresentantLegal,
      email,
    } = projet;

    if (!appelOffreProjet) {
      return notFoundResponse({ request, response, ressourceTitle: "Appel d'offres" });
    }

    const régionDreal = await userRepo.findDrealsForUser(request.user.id);
    // Si plusieurs régions, on récupère la première qui coincide avec le projet
    const drealProjet = régionDreal.find((dreal) => regionProjet.includes(dreal));

    if (!drealProjet) {
      return unauthorizedResponse({ request, response });
    }

    const dépôtEnAttente = await mediator.send<ConsulterSuiviDépôtGarantiesFinancièresQuery>({
      type: 'CONSULTER_SUIVI_DÉPÔT_GARANTIES_FINANCIÈRES',
      data: {
        identifiantProjet: {
          appelOffre: appelOffreId,
          période: periodeId,
          famille: familleId,
          numéroCRE: numeroCRE,
        },
      },
    });

    if (isNone(dépôtEnAttente)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
    }

    const filepath = path.join(
      os.tmpdir(),
      sanitize(`Mise en demeure Garanties Financières - ${drealProjet}.docx`),
    );

    const templatePath = path.resolve(
      __dirname,
      '../..',
      'views',
      'template',
      'Modèle mise en demeure v2.docx',
    );

    const imageToInject = path.resolve(
      __dirname,
      '../../public/images/dreals',
      `${drealProjet}.png`,
    );

    await fillDocxTemplate({
      templatePath,
      outputPath: filepath,
      injectImage: imageToInject,
      variables: {
        dreal: drealProjet,
        dateMiseEnDemeure: formatDate(Date.now()),
        contactDreal: request.user.email,
        referenceProjet: identifiantProjet.replace(/#/g, '-'),
        titreAppelOffre: appelOffreProjet.periode
          ? `${appelOffreProjet.periode.cahierDesCharges.référence} ${appelOffreProjet.title}`
          : '!!!AO NON DISPONIBLE!!!',
        dateLancementAppelOffre: appelOffreProjet.launchDate || '!!!AO NON DISPONIBLE!!!',
        nomProjet,
        adresseCompleteProjet: `${adresseProjet} ${codePostalProjet} ${communeProjet}`,
        puissanceProjet: puissance.toString(),
        unitePuissance: appelOffreProjet.unitePuissance || '!!!AO NON DISPONIBLE!!!',
        titrePeriode: appelOffreProjet.periode?.title || '!!!AO NON DISPONIBLE!!!',
        dateNotification: formatDate(notifiedOn),
        paragrapheGF:
          appelOffreProjet.renvoiRetraitDesignationGarantieFinancieres || '!!!AO NON DISPONIBLE!!!',
        garantieFinanciereEnMois:
          projet.famille?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? projet.famille.garantieFinanciereEnMois?.toString()
            : appelOffreProjet.soumisAuxGarantiesFinancieres === 'après candidature'
            ? appelOffreProjet.garantieFinanciereEnMois.toString()
            : '!!!GARANTIE FINANCIERE EN MOIS NON DISPONIBLE!!!',
        dateFinGarantieFinanciere:
          projet.famille?.soumisAuxGarantiesFinancieres === 'après candidature'
            ? formatDate(
                moment(projet.notifiedOn)
                  .add(projet.famille.garantieFinanciereEnMois, 'months')
                  .toDate()
                  .getTime(),
              )
            : appelOffreProjet.soumisAuxGarantiesFinancieres === 'après candidature'
            ? formatDate(
                moment(notifiedOn)
                  .add(appelOffreProjet.garantieFinanciereEnMois, 'months')
                  .toDate()
                  .getTime(),
              )
            : '!!!FAMILLE NON DISPONIBLE!!!',
        dateLimiteDepotGF: dépôtEnAttente.dateLimiteDépôt
          ? formatDate(new Date(dépôtEnAttente.dateLimiteDépôt))
          : '!!!DATE LIMITE DEPOT NON DISPONIBLE!!!',
        nomRepresentantLegal,
        adresseProjet,
        codePostalProjet,
        communeProjet,
        emailProjet: email,
      },
    });

    return response.sendFile(path.resolve(process.cwd(), filepath));
  }),
);
