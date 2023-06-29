import React, { useState } from 'react';
import { ContentArea, CurrentIcon, ItemDate, ItemTitle, PastIcon } from '.';
import ROUTES from '@routes';
import { InfoItem } from './InfoItem';
import { WarningItem } from './WarningItem';
import { WarningIcon } from './WarningIcon';
import { GarantiesFinancièresDTO, ProjectStatus } from '@modules/frise';
import { format } from 'date-fns';
import { UserRole } from '@modules/users';

import {
  PrimaryButton,
  SecondaryButton,
  FormulaireChampsObligatoireLégende,
  Input,
  Label,
  Astérisque,
  DownloadLink,
  Dropdown,
  Link,
  Form,
} from '@components';
import { afficherDate } from '@views/helpers';

type ComponentProps = GarantiesFinancièresDTO & {
  project: {
    id: string;
    status: ProjectStatus;
    garantieFinanciereEnMois?: number;
    nomProjet: string;
  };
};

export const GFItem = (props: ComponentProps) => {
  const { statut, project } = props;

  switch (statut) {
    case 'en attente':
    case 'en retard':
      return project.status === 'Classé' ? <EnAttente {...{ ...props, statut, project }} /> : <></>;
    case 'à traiter':
      return <ATraiter {...{ ...props, statut, project }} />;
    case 'validé':
      return <Validé {...{ ...props, statut, project }} />;
  }
};

const rolesAutorisés = [
  'porteur-projet',
  'dreal',
  'admin',
  'caisse-des-dépôts',
  'cre',
  'dgec-validateur',
] as const;
const utilisateurPeutModifierLesGF = (role: UserRole): role is typeof rolesAutorisés[number] => {
  return (rolesAutorisés as readonly string[]).includes(role);
};

const getInfoDuréeGF = (garantieFinanciereEnMois?: number) => {
  return garantieFinanciereEnMois
    ? `la durée de l’engagement ne peut être inférieure à ${garantieFinanciereEnMois} mois.`
    : `La garantie doit avoir une durée couvrant le
            projet jusqu’à 6 mois après la date d’achèvement de l’installation ou être renouvelée
            régulièrement afin d’assurer une telle couverture temporelle.`;
};

type GFEnAttenteProps = ComponentProps & { statut: 'en attente' | 'en retard' };
const EnAttente = ({
  date: dateLimiteEnvoi,
  statut,
  variant,
  typeGarantiesFinancières,
  dateEchéance,
  actionPossible,
  project: { nomProjet, id: projectId, garantieFinanciereEnMois },
}: GFEnAttenteProps) => {
  const afficherAlerteRetard = statut === 'en retard' && variant === 'porteur-projet';
  const utilisateurEstAdmin = variant === 'dreal' || variant === 'admin';
  return (
    <>
      {afficherAlerteRetard ? <WarningIcon /> : <CurrentIcon />}
      <ContentArea>
        <div className="flex">
          <div className="align-middle">
            {dateLimiteEnvoi !== 0 && <ItemDate date={dateLimiteEnvoi} />}
          </div>
          {afficherAlerteRetard && (
            <div className="align-middle mb-1">
              <WarningItem message="date dépassée" />
            </div>
          )}
        </div>
        <ItemTitle title={'Garanties financières'} />
        <div>
          <div className="flex flex-col">
            {typeGarantiesFinancières && (
              <p className="mt-0 mb-0">type : "{typeGarantiesFinancières}"</p>
            )}
            {dateEchéance && (
              <p className="mt-0 mb-0">
                Date d'échéance des garanties financières : {afficherDate(dateEchéance)}
              </p>
            )}
            <p className="mt-0 mb-0">
              Attestation de constitution de garanties financières en attente
            </p>
          </div>
          {actionPossible && (
            <Formulaire
              projetId={projectId}
              garantieFinanciereEnMois={garantieFinanciereEnMois}
              action={actionPossible}
              role={variant}
              dateEchéance={dateEchéance}
            />
          )}
          {utilisateurEstAdmin && statut === 'en retard' && (
            <p className="m-0">
              <DownloadLink
                fileUrl={ROUTES.TELECHARGER_MODELE_MISE_EN_DEMEURE({
                  id: projectId,
                  nomProjet,
                })}
              >
                Télécharger le modèle de mise en demeure
              </DownloadLink>
            </p>
          )}
        </div>
      </ContentArea>
    </>
  );
};

type FormulaireProps = {
  projetId: string;
  garantieFinanciereEnMois?: number;
  action: 'soumettre' | 'enregistrer';
  role: typeof rolesAutorisés[number];
  dateEchéance: number | undefined;
};
const Formulaire = ({
  projetId,
  garantieFinanciereEnMois,
  action,
  role,
  dateEchéance,
}: FormulaireProps) => {
  const [displayForm, showForm] = useState(false);

  return (
    <Dropdown
      design="link"
      isOpen={displayForm}
      changeOpenState={(isOpen) => showForm(isOpen)}
      text={
        action === 'soumettre'
          ? 'Soumettre une attestation de garanties financières'
          : `Enregistrer une attestation de garanties financières`
      }
    >
      <Form
        action={
          action === 'soumettre'
            ? ROUTES.SUBMIT_GARANTIES_FINANCIERES({ projectId: projetId })
            : ROUTES.UPLOAD_GARANTIES_FINANCIERES({ projectId: projetId })
        }
        method="post"
        encType="multipart/form-data"
        className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
      >
        <FormulaireChampsObligatoireLégende className="ml-auto" />
        {action === 'enregistrer' && (
          <p className="m-0 italic">
            L'attestation que vous enregistrez ne sera pas soumise à validation par la DREAL
            concernée. Les garanties financières doivent déjà avoir été validée (soit à la
            candidature, soit par la DREAL).
          </p>
        )}
        {action === 'soumettre' && (
          <p className="m-0 italic">
            L'attestation que vous enregistrez sera soumise à validation par la DREAL concernée.
          </p>
        )}
        <input type="hidden" name="type" id="type" value="garanties-financieres" />
        <input type="hidden" name="projectId" value={projetId} />
        <div>
          <Label required htmlFor="stepDate">
            Date de constitution des garanties financières
          </Label>
          <Input
            type="date"
            name="stepDate"
            id="stepDate"
            max={format(new Date(), 'yyyy-MM-dd')}
            required
          />
        </div>
        <div>
          <Label required htmlFor="expirationDate">
            Date d'échéance des garanties
            <Astérisque className="text-black" />
          </Label>
          <Input
            type="date"
            name="expirationDate"
            id="expirationDate"
            required
            defaultValue={dateEchéance && format(new Date(dateEchéance), 'yyyy-MM-dd')}
          />
        </div>
        <div>
          <Label required htmlFor="file">
            Attestation
          </Label>
          <Input type="file" name="file" id="file" required />
        </div>
        <p className="m-0 mt-3 italic">
          <Astérisque className="text-black" />
          {getInfoDuréeGF(garantieFinanciereEnMois)}
        </p>
        <div className="flex gap-4 flex-col md:flex-row mx-auto">
          <PrimaryButton type="submit">Envoyer</PrimaryButton>
          <SecondaryButton onClick={() => showForm(false)}>Annuler</SecondaryButton>
        </div>
      </Form>
    </Dropdown>
  );
};

type ATraiterProps = ComponentProps & { statut: 'à traiter' };
const ATraiter = ({
  date: dateConstitution,
  url,
  variant,
  project,
  dateEchéance,
  typeGarantiesFinancières,
  retraitDépôtPossible,
}: ATraiterProps) => {
  const utilisateurEstAdmin = variant === 'dreal' || variant === 'admin';
  const modificationAutorisée = utilisateurPeutModifierLesGF(variant);

  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-middle">
            <ItemDate date={dateConstitution} />
          </div>
          <div className="align-middle mb-1">
            {project.status === 'Classé' && (
              <InfoItem message={utilisateurEstAdmin ? 'à traiter' : 'validation en attente'} />
            )}
          </div>
        </div>
        <ItemTitle title={'Constitution des garanties financières'} />
        {typeGarantiesFinancières && (
          <p className="mt-0 mb-0">type : "{typeGarantiesFinancières}"</p>
        )}
        <DateEchéance
          dateEchéance={dateEchéance}
          projetId={project.id}
          modificationAutorisée={modificationAutorisée}
          garantieFinanciereEnMois={project.garantieFinanciereEnMois}
        />
        <div className="flex">
          {url ? (
            <DownloadLink fileUrl={url}>
              Télécharger l'attestation de garanties financières
            </DownloadLink>
          ) : (
            <span>Pièce-jointe introuvable</span>
          )}
        </div>
        {retraitDépôtPossible && <AnnulerDépôt projetId={project.id} />}
      </ContentArea>
    </>
  );
};

type DateEchéanceProps = {
  projetId: string;
  modificationAutorisée: boolean;
  dateEchéance: number | undefined;
  garantieFinanciereEnMois?: number;
};
const DateEchéance = ({
  projetId,
  modificationAutorisée,
  dateEchéance,
  garantieFinanciereEnMois,
}: DateEchéanceProps) => {
  return (
    <>
      <div>
        {dateEchéance && <p className="m-0">Date d'échéance : {afficherDate(dateEchéance)}</p>}
        {modificationAutorisée && (
          <DateEchéanceFormulaire
            projetId={projetId}
            garantieFinanciereEnMois={garantieFinanciereEnMois}
            action={dateEchéance ? 'Éditer' : 'Ajouter'}
          />
        )}
      </div>
    </>
  );
};

type DateEchéanceFormulaireProps = {
  projetId: string;
  garantieFinanciereEnMois?: number;
  action: 'Éditer' | 'Ajouter';
};
const DateEchéanceFormulaire = ({
  projetId,
  garantieFinanciereEnMois,
  action,
}: DateEchéanceFormulaireProps) => {
  const [displayForm, showForm] = useState(false);
  return (
    <Dropdown
      design="link"
      text={`${action} la date d'échéance`}
      isOpen={displayForm}
      changeOpenState={(isOpen) => showForm(isOpen)}
    >
      <Form
        action={ROUTES.ADD_GF_EXPIRATION_DATE({ projectId: projetId })}
        method="POST"
        className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
      >
        <FormulaireChampsObligatoireLégende className="ml-auto" />
        <input name="projectId" value={projetId} readOnly hidden />
        <div>
          <Label htmlFor="expirationDate" required>
            Date d'échéance des garanties financières
            <Astérisque className="text-black" />
          </Label>
          <Input required type="date" name="expirationDate" id="expirationDate" />
        </div>
        <p className="italic m-0">
          <Astérisque className="text-black" /> À noter : {getInfoDuréeGF(garantieFinanciereEnMois)}
        </p>
        <div className="mx-auto flex gap-4 flex-col md:flex-row">
          <PrimaryButton type="submit">Enregistrer</PrimaryButton>
          <SecondaryButton onClick={() => showForm(false)}>Annuler</SecondaryButton>
        </div>
      </Form>
    </Dropdown>
  );
};

type AnnulerDépôtProps = {
  projetId: string;
};
const AnnulerDépôt = ({ projetId }: AnnulerDépôtProps) => (
  <Link
    href={ROUTES.REMOVE_GARANTIES_FINANCIERES({
      projectId: projetId,
    })}
    confirmation="Êtes-vous sur de vouloir annuler le dépôt et supprimer l'attestion jointe ?"
  >
    Annuler le dépôt
  </Link>
);

type ValidéProps = ComponentProps & { statut: 'validé' };
const Validé = ({
  date: dateConstitution,
  url,
  dateEchéance,
  variant,
  envoyéesPar,
  retraitDépôtPossible,
  typeGarantiesFinancières,
  project,
}: ValidéProps) => {
  const modificationAutorisée = utilisateurPeutModifierLesGF(variant);

  return (
    <>
      <PastIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-middle">
            <ItemDate date={dateConstitution} />
          </div>
        </div>
        <ItemTitle title={'Constitution des garanties financières'} />
        {typeGarantiesFinancières && (
          <p className="mt-0 mb-0">type : "{typeGarantiesFinancières}"</p>
        )}
        <DateEchéance
          dateEchéance={dateEchéance}
          projetId={project.id}
          modificationAutorisée={modificationAutorisée}
          garantieFinanciereEnMois={project.garantieFinanciereEnMois}
        />
        <div>
          {url ? (
            <>
              <DownloadLink fileUrl={url}>
                Télécharger l'attestation de garanties financières
              </DownloadLink>
              <span>&nbsp;(validée)</span>
            </>
          ) : (
            <span>Pièce-jointe introuvable</span>
          )}
        </div>
        {retraitDépôtPossible && <RetirerDocument projetId={project.id} />}
        {envoyéesPar === 'dreal' && (
          <p className="m-0 italic">Ce document a été ajouté par la DREAL</p>
        )}
        {envoyéesPar === 'admin' && (
          <p className="m-0 italic">Ce document a été ajouté par la DGEC</p>
        )}
      </ContentArea>
    </>
  );
};

type RetirerDocumentProps = {
  projetId: string;
};
const RetirerDocument = ({ projetId }: RetirerDocumentProps) => (
  <p className="p-0 m-0">
    <Link
      href={ROUTES.WITHDRAW_GARANTIES_FINANCIERES({
        projectId: projetId,
      })}
      confirmation="Êtes-vous sur de vouloir retirer l'attestion jointe ?"
    >
      Retirer le document de Potentiel
    </Link>
  </p>
);
