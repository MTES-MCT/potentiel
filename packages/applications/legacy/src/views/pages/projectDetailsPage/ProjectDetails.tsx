import { ProjectDataForProjectPage } from '../../../modules/project/queries';
import { Request } from 'express';
import React, { FC } from 'react';
import { userIs } from '../../../modules/users';
import {
  Callout,
  Link,
  ExternalLink,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  AlertBox,
  Heading2,
} from '../../components';
import { afficherDate, hydrateOnClient } from '../../helpers';
import {
  EtapesProjet,
  InfoGenerales,
  Contact,
  MaterielsEtTechnologies,
  ResultatsAppelOffreInnovation,
  ContactProps,
  InfoGeneralesProps,
  GarantiesFinancièresProjetProps,
  EtapesProjetProps,
  MaterielsEtTechnologiesProps,
} from './sections';
import { ProjectHeader } from './components';
import { Routes } from '@potentiel-applications/routes';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../helpers/dataToValueTypes';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import {
  DemandeImpossibleSiAbandonEnCoursInfoBox,
  DemandeImpossibleSiAchèvementInfoBox,
} from './sections/DemandeImpossibleInfoBox';
import { DemandeAbandonEnCoursInfoBox } from './sections/DemandeEnCoursInfoBox';
import { DateTime } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat, Éliminé } from '@potentiel-domain/projet';
import { GetRaccordementForProjectPage } from '../../../controllers/project/getProjectPage/_utils';
import { Dépôt } from '@potentiel-domain/projet/dist/candidature';

export type AlerteRaccordement =
  | 'référenceDossierManquantePourDélaiCDC2022'
  | 'demandeComplèteRaccordementManquante';

type ProjectDetailsProps = {
  request: Request;
  project: ProjectDataForProjectPage;
  raccordement: GetRaccordementForProjectPage;
  alertesRaccordement: AlerteRaccordement[];
  abandon?: PlainType<Lauréat.Abandon.ConsulterAbandonReadModel>;
  demandeRecours?: PlainType<Éliminé.Recours.ConsulterRecoursReadModel>;
  garantiesFinancières?: GarantiesFinancièresProjetProps['garantiesFinancières'];
  représentantLégal?: ContactProps['représentantLégal'];
  actionnaire?: InfoGeneralesProps['actionnaire'];
  puissance?: InfoGeneralesProps['puissance'];
  producteur?: ContactProps['producteur'];
  installateur?: InfoGeneralesProps['installateur'];
  attestationConformité?: InfoGeneralesProps['attestationConformité'];
  dateAchèvementPrévisionnel: number;
  estAchevé: boolean;
  modificationsNonPermisesParLeCDCActuel: boolean;
  coefficientKChoisi: boolean | undefined;
  emailContact: string;
  fournisseur: MaterielsEtTechnologiesProps['fournisseur'];
  délai: {
    affichage?: {
      labelActions: string;
      url: string;
    };
  };
  autorisationDUrbanisme: Dépôt.ValueType['autorisationDUrbanisme'];
  installationAvecDispositifDeStockage?: InfoGeneralesProps['installationAvecDispositifDeStockage'];
  natureDeLExploitation?: InfoGeneralesProps['natureDeLExploitation'];
  statutLauréat: Lauréat.StatutLauréat.RawType;
};

export const ProjectDetails = ({
  request,
  project,
  raccordement,
  alertesRaccordement,
  abandon,
  demandeRecours,
  estAchevé,
  attestationConformité,
  dateAchèvementPrévisionnel,
  représentantLégal,
  actionnaire,
  garantiesFinancières,
  puissance,
  modificationsNonPermisesParLeCDCActuel,
  coefficientKChoisi,
  producteur,
  emailContact,
  fournisseur,
  délai,
  autorisationDUrbanisme,
  installateur,
  installationAvecDispositifDeStockage,
  natureDeLExploitation,
  statutLauréat,
}: ProjectDetailsProps) => {
  const { user } = request;
  const { error, success } = (request.query as any) || {};

  const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId: project.appelOffreId,
    periodeId: project.periodeId,
    familleId: project.familleId,
    numeroCRE: project.numeroCRE,
  }).formatter();

  const abandonEnCoursOuAccordé = !!abandon && abandon.statut.statut !== 'rejeté';
  const abandonEnCours = abandonEnCoursOuAccordé && abandon.statut.statut !== 'accordé';

  const affichageInfobox = abandonEnCours ? (
    user.role === 'porteur-projet' ? (
      <DemandeImpossibleSiAbandonEnCoursInfoBox identifiantProjet={identifiantProjet} />
    ) : user.role === 'admin' || user.role === 'dreal' ? (
      <DemandeAbandonEnCoursInfoBox identifiantProjet={identifiantProjet} />
    ) : undefined
  ) : undefined;

  const étapes: EtapesProjetProps['étapes'] = [
    {
      type: 'designation',
      date: project.notifiedOn,
    },
  ];

  if (abandon?.demande.accord) {
    étapes.push({
      type: 'abandon',
      date: DateTime.bind(abandon.demande.accord?.accordéLe).date.getTime(),
    });
  } else {
    if (demandeRecours?.demande.accord) {
      étapes.push({
        type: 'recours',
        date: DateTime.bind(demandeRecours.demande.accord?.accordéLe).date.getTime(),
      });
    }

    étapes.push({
      type: 'achèvement-prévisionel',
      date: dateAchèvementPrévisionnel,
    });

    const dernierDossierRaccordement = Option.match(raccordement.raccordement)
      .some(({ dossiers }) => (dossiers.length > 0 ? dossiers[dossiers.length - 1] : undefined))
      .none(() => undefined);

    if (dernierDossierRaccordement?.miseEnService?.dateMiseEnService) {
      étapes.push({
        type: 'mise-en-service',
        date: DateTime.bind(
          dernierDossierRaccordement.miseEnService.dateMiseEnService,
        ).date.getTime(),
      });
    }

    if (attestationConformité?.date) {
      étapes.push({
        type: 'achèvement-réel',
        date: attestationConformité.date,
      });
    }
  }

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-projects">
      <p className="hidden print:block m-0 mb-2 font-semibold">
        Ce document a été édité le {afficherDate(new Date())}. <br />
        Les informations affichées sur cette page reflètent la situation du projet en fonction des
        éléments fournis à Potentiel à date. Elles sont susceptibles de modifications ultérieures.
      </p>
      <ProjectHeader
        user={user}
        project={project}
        abandonEnCoursOuAccordé={abandonEnCoursOuAccordé}
        modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
        estAchevé={estAchevé}
        demandeRecours={demandeRecours && { statut: demandeRecours.statut.value }}
        représentantLégalAffichage={représentantLégal?.affichage}
        puissanceAffichage={puissance?.affichage}
        actionnaireAffichage={actionnaire?.affichage}
        producteurAffichage={producteur?.affichage}
        fournisseurAffichage={fournisseur?.affichage}
        délaiAffichage={délai.affichage}
        installateurAffichage={installateur?.affichage}
        features={user.features}
        installationAvecDispositifDeStockageAffichage={
          installationAvecDispositifDeStockage?.affichage
        }
        natureDeLExploitationAffichage={natureDeLExploitation?.affichage}
        statutLauréat={statutLauréat}
      />
      <div className="print:hidden">
        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <div className="print:hidden flex flex-col gap-3">
          {affichageInfobox}
          {estAchevé && user.role === 'porteur-projet' && <DemandeImpossibleSiAchèvementInfoBox />}
          {user.role === 'porteur-projet' && modificationsNonPermisesParLeCDCActuel && (
            <AlertBox>
              Votre cahier des charges actuel ne vous permet pas d'accéder aux fonctionnalités
              dématérialisées d'information au Préfet et de modification de votre projet (abandon,
              recours...)
              {project.isClasse &&
                `, vous devez d'abord choisir un cahier des charges modificatif (encart
              "Cahier des charges" ci-dessous)`}
              .
            </AlertBox>
          )}
          {!abandonEnCours && alertesRaccordement.length > 0 && (
            <AlerteBoxRaccordement
              dcrDueOn={project.dcrDueOn}
              alertes={alertesRaccordement}
              identifiantProjet={identifiantProjet}
            />
          )}
          <Callout>
            <CDCInfo
              cahierDesChargesActuel={project.cahierDesChargesActuel}
              user={user}
              urlChoixCdc={Routes.CahierDesCharges.choisir(identifiantProjet)}
              isClasse={project.isClasse}
            />
          </Callout>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1">
            <EtapesProjet
              identifiantProjet={identifiantProjet}
              isLegacy={project.isLegacy}
              étapes={étapes}
            />
          </div>
          <div className="flex flex-col flex-1 gap-3 break-before-page">
            <InfoGenerales
              project={project}
              role={Role.convertirEnValueType(user.role)}
              raccordement={raccordement}
              demandeRecours={demandeRecours && { statut: demandeRecours.statut.value }}
              garantiesFinancières={garantiesFinancières}
              actionnaire={actionnaire}
              puissance={puissance}
              modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
              coefficientKChoisi={coefficientKChoisi}
              estAchevé={estAchevé}
              attestationConformité={attestationConformité}
              autorisationDUrbanisme={autorisationDUrbanisme}
              installateur={installateur}
              installationAvecDispositifDeStockage={installationAvecDispositifDeStockage}
              natureDeLExploitation={natureDeLExploitation}
            />
            <Contact
              identifiantProjet={identifiantProjet}
              project={project}
              user={user}
              représentantLégal={représentantLégal}
              producteur={producteur}
              modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
              emailContact={emailContact}
            />
            <MaterielsEtTechnologies
              fournisseur={fournisseur}
              modificationsNonPermisesParLeCDCActuel={modificationsNonPermisesParLeCDCActuel}
            />

            {project.notesInnovation && (
              <ResultatsAppelOffreInnovation
                note={project.note}
                notePrix={project.notePrix}
                notesInnovation={project.notesInnovation}
              />
            )}
          </div>
        </div>
      </div>
    </LegacyPageTemplate>
  );
};

type CDCInfoProps = Pick<ProjectDataForProjectPage, 'isClasse' | 'cahierDesChargesActuel'> & {
  user: Request['user'];
  urlChoixCdc: string;
};

const CDCInfo = ({ cahierDesChargesActuel, user, urlChoixCdc, isClasse }: CDCInfoProps) => (
  <>
    <Heading2 className="my-0 text-2xl">Cahier des charges</Heading2>{' '}
    <div>
      Instruction selon le cahier des charges{' '}
      {cahierDesChargesActuel.type === 'initial'
        ? 'initial (en vigueur à la candidature)'
        : `${
            cahierDesChargesActuel.alternatif ? 'alternatif' : ''
          } modifié rétroactivement et publié le ${cahierDesChargesActuel.paruLe}`}{' '}
      {cahierDesChargesActuel.url && (
        <>
          (<ExternalLink href={cahierDesChargesActuel.url}>voir le cahier des charges</ExternalLink>
          )
        </>
      )}
      <br />
      {userIs('porteur-projet')(user) && isClasse && (
        <Link className="flex mt-4" href={urlChoixCdc}>
          Accéder au choix du cahier des charges
        </Link>
      )}
    </div>
  </>
);

const AlerteBoxRaccordement: FC<{
  dcrDueOn: ProjectDataForProjectPage['dcrDueOn'];
  alertes: AlerteRaccordement[];
  identifiantProjet: string;
}> = ({ dcrDueOn, alertes, identifiantProjet }) => (
  <AlertBox title="Données de raccordement à compléter">
    {alertes.includes('référenceDossierManquantePourDélaiCDC2022') && (
      <p>
        Afin de nous permettre de vérifier si le délai relatif au cahier des charges du 30/08/2022
        concerne le projet pour l'appliquer le cas échéant, nous vous invitons à renseigner une
        référence de dossier de raccordement et à vous assurer que le gestionnaire de réseau indiqué{' '}
        <Link href={Routes.Raccordement.détail(identifiantProjet)}>sur cette page</Link> est
        correct.
      </p>
    )}
    {alertes.includes('demandeComplèteRaccordementManquante') && (
      <p>
        Vous devez déposer une demande de raccordement avant le {afficherDate(dcrDueOn)} auprès de
        votre gestionnaire de réseau.
        <br />
        L'accusé de réception de cette demande ainsi que les documents complémentaires (proposition
        technique et financière…) transmis sur Potentiel faciliteront vos démarches administratives
        avec les différents acteurs connectés à Potentiel (DGEC, services de l'Etat en région,
        Cocontractant, etc.).
      </p>
    )}
    <Link href={Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet)}>
      Mettre à jour les données de raccordement de mon projet
    </Link>
  </AlertBox>
);

hydrateOnClient(ProjectDetails);
