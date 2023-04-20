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
} from '@components';
import { afficherDate, hydrateOnClient } from '../../helpers';
import {
  DossierRaccordementReadModel,
  GestionnaireRéseauReadModel,
  RésuméProjetReadModel,
} from '@potentiel/domain';
import routes from '@routes';
import { RiArrowRightCircleLine } from '@react-icons/all-files/ri/RiArrowRightCircleLine';
import { formatDate } from '../../../helpers/formatDate';

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
}: ListeDossiersRaccordementProps) => {
  return (
    <PageProjetTemplate
      titre={
        <>
          <PlugIcon className="mr-1" />
          Raccordement
        </>
      }
      user={user}
      résuméProjet={résuméProjet}
    >
      {success && <SuccessBox>{success}</SuccessBox>}

      <div className="my-2 md:my-4">
        {dossiers.length === 1 ? (
          <Dossier identifiantProjet={identifiantProjet} dossier={dossiers[0]} />
        ) : (
          <ListeDossiers identifiantProjet={identifiantProjet} dossiers={dossiers} />
        )}
      </div>

      <InfoBox className="py-4">
        Si le raccordement de votre projet est réalisé en plusieurs étapes, vous pouvez{' '}
        <Link href={routes.GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE(identifiantProjet)}>
          transmettre une autre demande complète de raccordement
        </Link>
        .
      </InfoBox>
    </PageProjetTemplate>
  );
};
hydrateOnClient(ListeDossiersRaccordement);

const Dossier: FC<{ identifiantProjet: string; dossier: DossierRaccordementReadModel }> = ({
  identifiantProjet,
  dossier: { référence, dateQualification, propositionTechniqueEtFinancière, dateMiseEnService },
}) => (
  <div className="flex flex-col md:flex-row justify-items-stretch">
    <div className="flex flex-col p-5 border-2 border-solid border-success-425-base bg-green-50 w-full md:w-1/3">
      <div className="flex flex-row items-center md:flex-col gap-3 mb-5">
        <SuccessIcon className="w-8 h-8 md:mx-auto text-success-425-base" />
        <div className="uppercase font-bold text-sm">Demande complète de raccordement</div>
      </div>

      <div className="flex flex-col uppercase text-sm gap-2">
        <div>Dossier {référence}</div>
        <div>Date {formatDate(new Date(dateQualification))}</div>
      </div>
    </div>
    <div className="flex flex-col my-3 mx-auto md:mx-3">
      <RiArrowRightCircleLine className="w-12 h-12 my-auto text-blue-france-sun-base" />
    </div>
    <div className="flex flex-col p-5 gap-2 md:gap-5 border border-solid border-blue-france-sun-base w-full md:w-1/3">
      <div className="flex flex-row items-center md:flex-col gap-3 mb-5">
        <ClockIcon className="w-8 h-8 md:mx-auto" />
        <div className="uppercase font-bold text-sm ">Proposition technique et financière</div>
      </div>
    </div>
    <div className="flex flex-col my-3 mx-auto md:mx-3">
      <RiArrowRightCircleLine className="w-12 h-12 my-auto text-blue-france-sun-base" />
    </div>
    <div className="flex flex-col p-5 gap-2 md:gap-5 border border-solid border-blue-france-sun-base w-full md:w-1/3">
      <div className="flex flex-row items-center md:flex-col gap-3 mb-5">
        <ClockIcon className="w-8 h-8 md:mx-auto" />
        <div className="uppercase font-bold text-sm">Mise en service</div>
      </div>
    </div>
  </div>
);

const ListeDossiers: FC<{
  identifiantProjet: string;
  dossiers: ListeDossiersRaccordementProps['dossiers'];
}> = ({ identifiantProjet, dossiers }) => (
  <>
    {dossiers.map(
      ({ référence, dateQualification, dateMiseEnService, propositionTechniqueEtFinancière }) => (
        <Tile key={référence} className="mb-3 flex flex-row items-center justify-between">
          <ul className="list-none p-0">
            <li>Référence : {référence}</li>
            <li>Date de qualification : {afficherDate(new Date(dateQualification))}</li>
            <li>
              <DownloadLink
                fileUrl={routes.GET_ACCUSE_RECEPTION_FILE(identifiantProjet, référence)}
              >
                Télécharger l'accusé de réception
              </DownloadLink>
            </li>
            <li>
              Date de mise en service :{' '}
              {dateMiseEnService ? (
                <span>{afficherDate(new Date(dateMiseEnService))}</span>
              ) : (
                <span className="italic">Non renseignée</span>
              )}
              {['admin', 'dgec-validateur'].includes(user.role) && (
                <Link
                  href={routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(
                    identifiantProjet,
                    référence,
                  )}
                  className="ml-3"
                >
                  Transmettre la date de mise en service
                </Link>
              )}
            </li>
            <li>
              Date de signature de la proposition technique et financière :{' '}
              {propositionTechniqueEtFinancière ? (
                <>
                  <span>
                    {afficherDate(new Date(propositionTechniqueEtFinancière.dateSignature))}
                  </span>
                  <DownloadLink
                    fileUrl={routes.GET_PROPOSITION_TECHNIQUE_ET_FINANCIERE_FILE(
                      identifiantProjet,
                      référence,
                    )}
                  >
                    Télécharger la proposition technique et financière signée
                  </DownloadLink>
                </>
              ) : (
                <span className="italic">Non renseignée</span>
              )}
              {['admin', 'dgec-validateur', 'porteur-projet'].includes(user.role) && (
                <Link
                  href={routes.GET_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE(
                    identifiantProjet,
                    référence,
                  )}
                  className="ml-3"
                >
                  Transmettre la proposition technique et financière
                </Link>
              )}
            </li>
          </ul>
        </Tile>
      ),
    )}
  </>
);
