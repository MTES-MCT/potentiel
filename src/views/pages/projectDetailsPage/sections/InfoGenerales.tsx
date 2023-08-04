import React from 'react';
import { ProjectDataForProjectPage } from '@modules/project';
import {
  AlertMessage,
  BuildingIcon,
  DownloadLink,
  FinanceIcon,
  Heading3,
  Link,
  MapPinIcon,
  PlugIcon,
  PowerIcon,
  Section,
} from '@components';
import routes from '@routes';
import { UserRole } from '@modules/users';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import { afficherDate } from '@views/helpers';

export type GarantiesFinancièresDataForProjetPage = {
  actionRequise?: 'compléter enregistrement' | 'enregistrer' | 'déposer';
  typeGarantiesFinancières?: "avec date d'échéance" | 'consignation' | '6 mois après achèvement';
  dateÉchéance?: string;
  attestationConstitution?: { format: string; date: string };
};

type InfoGeneralesProps = {
  project: ProjectDataForProjectPage;
  role: UserRole;
  garantiesFinancières?: GarantiesFinancièresDataForProjetPage;
};

export const InfoGenerales = ({ project, role, garantiesFinancières }: InfoGeneralesProps) => (
  <Section title="Informations générales" icon={<BuildingIcon />} className="flex flex-col">
    <div className="mb-6">
      <Heading3 className="m-0 flex items-center">
        <PowerIcon className="text-yellow-moutarde-850-base mr-1 shrink-0" aria-hidden />
        <span className="text-sm font-semibold tracking-wide uppercase">puissance</span>
      </Heading3>
      <p className="my-0 pl-6">
        Puissance installée : {project.puissance} {project.appelOffre?.unitePuissance}
      </p>
    </div>
    <div className="mb-6">
      <Heading3 className="m-0 flex items-center">
        <MapPinIcon className="text-red-marianne-main-472-base mr-1 shrink-0" aria-hidden />
        <span className="text-sm font-semibold tracking-wide uppercase">site de production</span>
      </Heading3>
      <div className="pl-6">
        <span className="m-0">{project.adresseProjet}</span>
        <br />
        <span className="m-0">
          {project.codePostalProjet} {project.communeProjet}
        </span>
        <br />
        <span className="m-0">
          {project.departementProjet}, {project.regionProjet}
        </span>
      </div>
    </div>
    {project.isClasse &&
    !project.isAbandoned &&
    ['admin', 'dgec-validateur', 'porteur-projet', 'dreal', 'acheteur-obligé', 'cre'].includes(
      role,
    ) ? (
      <div className="mb-6">
        <Heading3 className="m-0 flex items-center">
          <PlugIcon className="text-info-425-base mr-1 shrink-0" aria-hidden />
          <span className="text-sm font-semibold tracking-wide uppercase">
            raccordement au réseau
          </span>
        </Heading3>
        <div className="pl-6">
          <Link
            href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(
              convertirEnIdentifiantProjet({
                appelOffre: project.appelOffreId,
                période: project.periodeId,
                famille: project.familleId,
                numéroCRE: project.numeroCRE,
              }).formatter(),
            )}
          >
            Mettre à jour ou consulter les données de raccordement
          </Link>
        </div>
      </div>
    ) : null}

    {project.appelOffre.isSoumisAuxGF && (
      <div className="mb-6">
        <Heading3 className="m-0 flex items-center">
          <FinanceIcon className="text-brown-caramel-main-648-base mr-1 shrink-0" aria-hidden />
          <span className="text-sm font-semibold tracking-wide uppercase">
            garanties financières
          </span>
        </Heading3>
        <div className="pl-6">
          {garantiesFinancières?.actionRequise === 'enregistrer' && (
            <AlertMessage message="Garanties financières à enregistrer" />
          )}
          {garantiesFinancières?.actionRequise === 'déposer' && (
            <AlertMessage message="Garanties financières à déposer" />
          )}
          {garantiesFinancières?.actionRequise === 'compléter enregistrement' && (
            <AlertMessage message="Garanties financières à compléter" />
          )}
          <div className="flex flex-col gap-2">
            {garantiesFinancières?.typeGarantiesFinancières === "avec date d'échéance" &&
              garantiesFinancières?.dateÉchéance && (
                <div>
                  Garanties Financières avec date d'échéance au{' '}
                  {afficherDate(new Date(garantiesFinancières.dateÉchéance))}
                </div>
              )}
            {garantiesFinancières?.typeGarantiesFinancières === '6 mois après achèvement' && (
              <div>Garanties Financières valides jusqu'à six mois après l'achèvement</div>
            )}
            {garantiesFinancières?.typeGarantiesFinancières === 'consignation' && (
              <div>Garanties financières de type consignation</div>
            )}

            {garantiesFinancières?.attestationConstitution && (
              <DownloadLink
                fileUrl={routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES(
                  convertirEnIdentifiantProjet({
                    appelOffre: project.appelOffreId,
                    période: project.periodeId,
                    famille: project.familleId,
                    numéroCRE: project.numeroCRE,
                  }).formatter(),
                )}
              >
                Télécharger l'attestation (constituée le{' '}
                {afficherDate(new Date(garantiesFinancières.attestationConstitution.date))})
              </DownloadLink>
            )}

            {garantiesFinancières?.actionRequise !== 'déposer' && (
              <Link
                href={routes.GET_ENREGISTRER_GARANTIES_FINANCIERES_PAGE(
                  convertirEnIdentifiantProjet({
                    appelOffre: project.appelOffreId,
                    période: project.periodeId,
                    famille: project.familleId,
                    numéroCRE: project.numeroCRE,
                  }).formatter(),
                )}
              >
                Mettre à jour les garanties financières
              </Link>
            )}
          </div>
        </div>
      </div>
    )}
  </Section>
);
