import React, { useState } from 'react';
import { ContentArea, CurrentIcon, ItemDate, ItemTitle, PastIcon } from '.';
import ROUTES from '../../../../routes';
import { InfoItem } from './InfoItem';
import { WarningItem } from './WarningItem';
import { WarningIcon } from './WarningIcon';
import { GarantiesFinancièresDTO, ProjectStatus } from '../../../../modules/frise';
import { format } from 'date-fns';

import {
  PrimaryButton,
  SecondaryButton,
  Input,
  Label,
  DownloadLink,
  Dropdown,
  Link,
  Form,
  ChampsObligatoiresLégende,
  Select,
} from '../..';
import { afficherDate } from '../../../helpers';
import { UserRole } from '../../../../modules/users';

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

const rolesAutorisésPourModificationTypeEtDateEchéance = [
  'dreal',
  'admin',
  'caisse-des-dépôts',
  'cre',
  'dgec-validateur',
] as const;

const getPeutModifierTypeEtDateEchéance = (
  role: UserRole,
): role is (typeof rolesAutorisésPourModificationTypeEtDateEchéance)[number] => {
  return (rolesAutorisésPourModificationTypeEtDateEchéance as readonly string[]).includes(role);
};

const getInfoDuréeGF = (garantieFinanciereEnMois?: number) => {
  return garantieFinanciereEnMois
    ? `la durée de l’engagement ne peut être inférieure à ${garantieFinanciereEnMois} mois.`
    : `La garantie doit avoir une durée couvrant le
            projet jusqu’à 6 mois après la date d’achèvement de l’installation ou être renouvelée
            régulièrement afin d’assurer une telle couverture temporelle.`;
};

// Timeline item par statut de garanties financières
type enAttenteProps = ComponentProps & { statut: 'en attente' | 'en retard' };
const EnAttente = ({
  date: dateLimiteEnvoi,
  statut,
  variant,
  typeGarantiesFinancières,
  dateEchéance,
  actionPossible,
  project: { nomProjet, id: projectId, garantieFinanciereEnMois },
}: enAttenteProps) => {
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
          {actionPossible === 'enregistrer' && (
            <Enregistrer
              projetId={projectId}
              role={variant}
              dateEchéance={dateEchéance}
              typeGarantiesFinancières={typeGarantiesFinancières}
              garantieFinanciereEnMois={garantieFinanciereEnMois}
            />
          )}
          {actionPossible === 'soumettre' && <SoumettreDépôt projetId={projectId} />}
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
  const peutModifierTypeEtDateEchéance = getPeutModifierTypeEtDateEchéance(variant);

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
        <TypeEtDateÉchéance
          garantieFinanciereEnMois={project.garantieFinanciereEnMois}
          peutModifierTypeEtDateEchéance={peutModifierTypeEtDateEchéance}
          projetId={project.id}
          dateEchéance={dateEchéance}
          typeGarantiesFinancières={typeGarantiesFinancières}
        />
        <div className="print:hidden">
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
        </div>
      </ContentArea>
    </>
  );
};

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
  const peutModifierTypeEtDateEchéance = getPeutModifierTypeEtDateEchéance(variant);

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
        <TypeEtDateÉchéance
          garantieFinanciereEnMois={project.garantieFinanciereEnMois}
          peutModifierTypeEtDateEchéance={peutModifierTypeEtDateEchéance}
          projetId={project.id}
          dateEchéance={dateEchéance}
          typeGarantiesFinancières={typeGarantiesFinancières}
        />
        <div className="print:hidden">
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
        </div>
      </ContentArea>
    </>
  );
};

// Composants internes
type EnregistrerProps = {
  projetId: string;
  role: string;
  typeGarantiesFinancières: ComponentProps['typeGarantiesFinancières'];
  dateEchéance: ComponentProps['dateEchéance'];
  garantieFinanciereEnMois: ComponentProps['project']['garantieFinanciereEnMois'];
};
const Enregistrer = ({
  projetId,
  role,
  typeGarantiesFinancières,
  dateEchéance,
  garantieFinanciereEnMois,
}: EnregistrerProps) => {
  const [displayForm, showForm] = useState(false);

  return (
    <Dropdown
      design="link"
      isOpen={displayForm}
      changeOpenState={(isOpen) => showForm(isOpen)}
      text="Enregistrer/mettre à jour les garanties financières du projet"
    >
      <Form
        action={ROUTES.UPLOAD_GARANTIES_FINANCIERES({ projectId: projetId })}
        method="post"
        encType="multipart/form-data"
        className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
      >
        <ChampsObligatoiresLégende />
        <p className="m-0 italic">
          L'attestation que vous enregistrez ne sera pas soumise à validation par la DREAL
          concernée. Les garanties financières doivent déjà avoir été validée (soit à la
          candidature, soit par la DREAL).
        </p>
        {role === 'porteur-projet' && (
          <p className="m-0 italic font-semibold">
            Une fois le document enregistré, vous ne pourrez plus le modifier.
          </p>
        )}
        <input type="hidden" name="projectId" value={projetId} />
        <div>
          <Label htmlFor="stepDate">Date de constitution des garanties financières</Label>
          <Input
            type="date"
            name="stepDate"
            id="stepDate"
            max={format(new Date(), 'yyyy-MM-dd')}
            required
            aria-required="true"
          />
        </div>
        <div>
          <Label htmlFor="file">Attestation</Label>
          <Input type="file" name="file" id="file" required aria-required="true" />
        </div>
        {role !== 'porteur-projet' && (
          <TypeEtDateEchéanceInputs
            garantieFinanciereEnMois={garantieFinanciereEnMois}
            typeGarantiesFinancières={typeGarantiesFinancières}
            dateEchéance={dateEchéance}
          />
        )}
        <div className="flex gap-4 flex-col md:flex-row mx-auto">
          <PrimaryButton type="submit">Envoyer</PrimaryButton>
          <SecondaryButton onClick={() => showForm(false)}>Annuler</SecondaryButton>
        </div>
      </Form>
    </Dropdown>
  );
};

type SoumettreDépôtProps = {
  projetId: string;
};
const SoumettreDépôt = ({ projetId }: SoumettreDépôtProps) => {
  const [displayForm, showForm] = useState(false);

  return (
    <Dropdown
      design="link"
      isOpen={displayForm}
      changeOpenState={(isOpen) => showForm(isOpen)}
      text="Soumettre de nouvelles garanties financières"
    >
      <Form
        action={ROUTES.SUBMIT_GARANTIES_FINANCIERES({ projectId: projetId })}
        method="post"
        encType="multipart/form-data"
        className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
      >
        <ChampsObligatoiresLégende />
        <p className="m-0 italic">
          L'attestation que vous enregistrez sera soumise à validation par la DREAL concernée.
        </p>
        <input type="hidden" name="type" id="type" value="garanties-financieres" />
        <input type="hidden" name="projectId" value={projetId} />
        <div>
          <Label htmlFor="stepDate">Date de constitution des garanties financières</Label>
          <Input
            type="date"
            name="stepDate"
            id="stepDate"
            max={format(new Date(), 'yyyy-MM-dd')}
            required
            aria-required="true"
          />
        </div>
        <div>
          <Label htmlFor="file">Attestation</Label>
          <Input type="file" name="file" id="file" required aria-required="true" />
        </div>
        <div className="flex gap-4 flex-col md:flex-row mx-auto">
          <PrimaryButton type="submit">Envoyer</PrimaryButton>
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

type TypeEtDateÉchéanceProps = {
  typeGarantiesFinancières?: ComponentProps['typeGarantiesFinancières'];
  dateEchéance?: ComponentProps['dateEchéance'];
  projetId: ComponentProps['project']['id'];
  peutModifierTypeEtDateEchéance: boolean;
  garantieFinanciereEnMois: ComponentProps['project']['garantieFinanciereEnMois'];
};
const TypeEtDateÉchéance = ({
  typeGarantiesFinancières,
  dateEchéance,
  projetId,
  peutModifierTypeEtDateEchéance,
  garantieFinanciereEnMois,
}: TypeEtDateÉchéanceProps) => {
  const [displayForm, showForm] = useState(false);

  return (
    <div>
      {typeGarantiesFinancières && <p className="mt-0 mb-0">type : "{typeGarantiesFinancières}"</p>}
      <div className="print:hidden">
        {dateEchéance && <p className="m-0">Date d'échéance : {afficherDate(dateEchéance)}</p>}
        {peutModifierTypeEtDateEchéance && (
          <Dropdown
            design="link"
            text={`Éditer le type ${dateEchéance ? "et la date d'échéance" : ''}`}
            isOpen={displayForm}
            changeOpenState={(isOpen) => showForm(isOpen)}
          >
            <Form
              action={ROUTES.ADD_GF_TYPE_AND_EXPIRATION_DATE({ projectId: projetId })}
              method="POST"
              className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
            >
              <input type="hidden" name="projectId" value={projetId} />
              <TypeEtDateEchéanceInputs
                garantieFinanciereEnMois={garantieFinanciereEnMois}
                typeGarantiesFinancières={typeGarantiesFinancières}
                dateEchéance={dateEchéance}
              />
              <div className="mx-auto flex gap-4 flex-col md:flex-row">
                <PrimaryButton type="submit">Enregistrer</PrimaryButton>
                <SecondaryButton onClick={() => showForm(false)}>Annuler</SecondaryButton>
              </div>
            </Form>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

type TypeEtDateEchéanceInputsProps = {
  garantieFinanciereEnMois?: number;
  typeGarantiesFinancières?: ComponentProps['typeGarantiesFinancières'];
  dateEchéance?: ComponentProps['dateEchéance'];
};
const TypeEtDateEchéanceInputs = ({
  garantieFinanciereEnMois,
  typeGarantiesFinancières,
  dateEchéance,
}: TypeEtDateEchéanceInputsProps) => {
  const [dateEchéanceRequise, setDateEchéanceRequise] = useState(
    typeGarantiesFinancières === "Garantie financière avec date d'échéance et à renouveler",
  );

  return (
    <>
      <div>
        <Label htmlFor="type">Type de garanties financières</Label>
        <Select
          name="type"
          id="type"
          defaultValue={typeGarantiesFinancières || 'default'}
          required
          aria-required="true"
          onChange={(e) => {
            setDateEchéanceRequise(
              e.target.value === "Garantie financière avec date d'échéance et à renouveler",
            );
          }}
        >
          <option value="default" disabled hidden>
            Choisir une type
          </option>
          <option value="Garantie financière avec date d'échéance et à renouveler">
            Garantie financière avec date d'échéance et à renouveler
          </option>
          <option value="Garantie financière jusqu'à 6 mois après la date d'achèvement">
            Garantie financière jusqu'à 6 mois après la date d'achèvement
          </option>
          <option value="Consignation">Consignation</option>
        </Select>
      </div>
      {dateEchéanceRequise && (
        <div>
          <Label htmlFor="dateEcheance">Date d'échéance</Label>
          <Input
            type="date"
            name="dateEcheance"
            id="dateEcheance"
            required
            aria-required="true"
            defaultValue={dateEchéance && format(new Date(dateEchéance), 'yyyy-MM-dd')}
          />
        </div>
      )}
      <p className="italic m-0">
        <span>*</span> À noter : {getInfoDuréeGF(garantieFinanciereEnMois)}
      </p>
    </>
  );
};
