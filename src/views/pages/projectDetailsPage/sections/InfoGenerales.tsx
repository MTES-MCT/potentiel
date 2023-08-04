import React from 'react';
import { ProjectDataForProjectPage } from '@modules/project';
import { AlertMessage, BuildingIcon, DownloadLink, Heading3, Link, Section } from '@components';
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
    <div>
      <Heading3 className="m-0">Performances</Heading3>
      <p className="m-0">
        Puissance installée: {project.puissance} {project.appelOffre?.unitePuissance}
      </p>
    </div>
    <div>
      <Heading3 className="mb-0">Site de production</Heading3>
      <p className="m-0">{project.adresseProjet}</p>
      <p className="m-0">
        {project.codePostalProjet} {project.communeProjet}
      </p>
      <p className="m-0">
        {project.departementProjet}, {project.regionProjet}
      </p>
    </div>
    {project.isClasse &&
    !project.isAbandoned &&
    ['admin', 'dgec-validateur', 'porteur-projet', 'dreal', 'acheteur-obligé', 'cre'].includes(
      role,
    ) ? (
      <div>
        <Heading3 className="mb-0">Raccordement au réseau</Heading3>
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
    ) : null}

    {project.appelOffre.isSoumisAuxGF && (
      <div>
        <Heading3 className="mb-0">Garanties financières</Heading3>
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
            <div>
              Garanties Financières avec date d'échéance valides jusqu'à six mois après l'achèvement
            </div>
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
    )}
  </Section>
);
