import React, { FC } from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  Link,
  DownloadLink,
  SuccessBox,
  Tile,
  PageProjetTemplate,
  PlugIcon,
  InfoBox,
  SuccessIcon,
  ClockIcon,
  CalendarIcon,
  TagIcon,
  ArrowDownWithCircle,
  ArrowRightWithCircle,
} from '@components';
import { afficherDate, hydrateOnClient } from '../../helpers';
import {
  DossierRaccordementReadModel,
  GestionnaireRéseauReadModel,
  RésuméProjetReadModel,
} from '@potentiel/domain';
import routes from '@routes';
import { userIs } from '@modules/users';

type ListeDossiersRaccordementProps = {
  user: UtilisateurReadModel;
  identifiantProjet: string;
  résuméProjet: RésuméProjetReadModel;
  gestionnaireRéseau: GestionnaireRéseauReadModel;
  dossiers: ReadonlyArray<DossierRaccordementReadModel>;
  success?: string;
};

export const ListeDossiersRaccordement = ({
  user,
  identifiantProjet,
  résuméProjet,
  gestionnaireRéseau,
  dossiers,
  success,
}: ListeDossiersRaccordementProps) => (
  <PageProjetTemplate
    titre={
      <>
        <PlugIcon className="mr-1" aria-hidden />
        Raccordement ({gestionnaireRéseau.raisonSociale})
      </>
    }
    user={user}
    résuméProjet={résuméProjet}
  >
    {success && <SuccessBox>{success}</SuccessBox>}

    <div className="my-2 md:my-4">
      {dossiers.length === 1 ? (
        <Dossier user={user} identifiantProjet={identifiantProjet} dossier={dossiers[0]} />
      ) : (
        dossiers.map((dossier) => (
          <Tile key={dossier.référence} className="mb-3">
            <Dossier user={user} identifiantProjet={identifiantProjet} dossier={dossier} />
          </Tile>
        ))
      )}
    </div>

    <InfoBox className="py-4">
      Si le raccordement comporte plusieurs points d'injection, vous pouvez{' '}
      <Link href={routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(identifiantProjet)}>
        transmettre une autre demande complète de raccordement
      </Link>
      .
    </InfoBox>
  </PageProjetTemplate>
);

hydrateOnClient(ListeDossiersRaccordement);

const Separateur = () => {
  return (
    <div className="flex flex-col my-3 mx-auto md:mx-3">
      <ArrowRightWithCircle
        className="w-12 h-12 my-auto text-blue-france-sun-base hidden md:block"
        aria-hidden
      />
      <ArrowDownWithCircle
        className="w-12 h-12 my-auto text-blue-france-sun-base block md:hidden"
        aria-hidden
      />
    </div>
  );
};

const Etape: FC<{
  faite: boolean;
  titre: string;
}> = ({ faite, titre, children }) => (
  <div
    className={`flex flex-col p-5 border-2 border-solid w-full md:max-w-none md:mx-0 md:w-1/3 ${
      faite ? 'border-success-425-base bg-green-50' : 'border-grey-625-base'
    }`}
  >
    <div className="flex flex-row items-center md:flex-col gap-3 mb-5">
      {faite ? (
        <SuccessIcon className="w-8 h-8 md:mx-auto text-success-425-base" title="étape validée" />
      ) : (
        <ClockIcon className="w-8 h-8 md:mx-auto text-grey-625-base" title="étape à venir" />
      )}
      <div className="uppercase font-bold text-sm">{titre}</div>
    </div>

    {children}
  </div>
);

const Dossier: FC<{
  user: UtilisateurReadModel;
  identifiantProjet: string;
  dossier: DossierRaccordementReadModel;
}> = ({
  user,
  identifiantProjet,
  dossier: { référence, dateQualification, propositionTechniqueEtFinancière, dateMiseEnService },
}) => (
  <div className="flex flex-col md:flex-row justify-items-stretch">
    <Etape faite={true} titre="Demande complète de raccordement">
      <div className="flex flex-col text-sm gap-2">
        <div className="flex items-center">
          <TagIcon className="mr-1" title="référence du dossier de raccordement" />
          <span className="font-bold">{référence}</span>
        </div>
        <div className="flex items-center">
          <CalendarIcon className="mr-1" title="date de l'accusé de réception" />
          {afficherDate(new Date(dateQualification))}
        </div>
        <div>
          <DownloadLink
            className="flex items-center"
            fileUrl={routes.GET_ACCUSE_RECEPTION_FILE(identifiantProjet, référence)}
          >
            Télécharger l'accusé de réception
          </DownloadLink>
        </div>
      </div>
    </Etape>
    <Separateur />
    <Etape titre="Proposition technique et financière" faite={!!propositionTechniqueEtFinancière}>
      {propositionTechniqueEtFinancière ? (
        <div className="flex flex-col text-sm gap-2">
          <div className="flex items-center">
            <CalendarIcon
              className="mr-1"
              title="date de signature de la proposition technique et financière"
            />
            {afficherDate(new Date(propositionTechniqueEtFinancière.dateSignature))}
          </div>
          <div>
            <DownloadLink
              className="flex items-center"
              fileUrl={routes.GET_PROPOSITION_TECHNIQUE_ET_FINANCIERE_FILE(
                identifiantProjet,
                référence,
              )}
            >
              Télécharger
            </DownloadLink>
          </div>
        </div>
      ) : (
        <Link
          className="mt-4 text-center"
          href={routes.GET_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE(
            identifiantProjet,
            référence,
          )}
        >
          Transmettre
        </Link>
      )}
    </Etape>
    <Separateur />
    <Etape faite={!!dateMiseEnService} titre="Mise en service">
      {dateMiseEnService ? (
        <div className="flex items-center">
          <CalendarIcon className="mr-1" title="date de mise en service" />
          {afficherDate(new Date(dateMiseEnService))}
        </div>
      ) : userIs(['admin'])(user) ? (
        <Link
          className="mt-4 text-center"
          href={routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(identifiantProjet, référence)}
        >
          Transmettre
        </Link>
      ) : (
        <p>La date de mise en service sera renseignée par la DGEC.</p>
      )}
    </Etape>
  </div>
);
