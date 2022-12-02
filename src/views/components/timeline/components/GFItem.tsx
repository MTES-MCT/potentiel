import React, { useState } from 'react'
import { ContentArea, CurrentIcon, ItemDate, ItemTitle, PastIcon } from '.'
import ROUTES from '@routes'
import { InfoItem } from './InfoItem'
import { WarningItem } from './WarningItem'
import { WarningIcon } from './WarningIcon'
import { GarantiesFinancièresDTO, ProjectStatus } from '@modules/frise'
import { formatDate } from '../../../../helpers/formatDate'
import { format } from 'date-fns'
import { UserRole } from '@modules/users'

import {
  Button,
  SecondaryButton,
  FormulaireChampsObligatoireLégende,
  Input,
  Label,
  Astérisque,
  DownloadLink,
  Dropdown,
  Link,
} from '@components'

type ComponentProps = GarantiesFinancièresDTO & {
  project: {
    id: string
    status: ProjectStatus
    garantieFinanciereEnMois?: number
    nomProjet: string
  }
}

export const GFItem = (props: ComponentProps) => {
  const { statut, project } = props

  switch (statut) {
    case 'en attente':
    case 'en retard':
      return <EnAttente {...{ ...props, statut, project }} />
    case 'à traiter':
      return <ATraiter {...{ ...props, statut, project }} />
    case 'validé':
      return <Validé {...{ ...props, statut, project }} />
  }
}

const rolesAutorisés = ['porteur-projet', 'dreal', 'admin'] as const
const utilisateurPeutModifierLesGF = (role: UserRole): role is typeof rolesAutorisés[number] => {
  return (rolesAutorisés as readonly string[]).includes(role)
}

const getInfoDuréeGF = (garantieFinanciereEnMois?: number) => {
  return garantieFinanciereEnMois
    ? `la durée de l’engagement ne peut être inférieure à ${garantieFinanciereEnMois} mois.`
    : `La garantie doit avoir une durée couvrant le
            projet jusqu’à 6 mois après la date d’achèvement de l’installation ou être renouvelée
            régulièrement afin d’assurer une telle couverture temporelle.`
}

type GFEnAttenteProps = ComponentProps & { statut: 'en attente' | 'en retard' }
const EnAttente = ({
  date: dateLimiteEnvoi,
  statut,
  variant,
  project: { nomProjet, id: projectId, garantieFinanciereEnMois },
}: GFEnAttenteProps) => {
  const utilisateurEstPorteur = variant === 'porteur-projet'
  const afficherAlerteRetard = statut === 'en retard' && utilisateurEstPorteur
  const utilisateurEstAdmin = variant === 'dreal' || variant === 'admin'
  const modificationAutorisée = utilisateurPeutModifierLesGF(variant)
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
          <div className="flex">
            <p className="mt-0 mb-0">
              Attestation de constitution de garanties financières en attente
            </p>
          </div>
          {modificationAutorisée && (
            <Formulaire
              projetId={projectId}
              garantieFinanciereEnMois={garantieFinanciereEnMois}
              action={utilisateurEstPorteur && dateLimiteEnvoi !== 0 ? 'soumettre' : 'enregistrer'}
              role={variant}
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
  )
}

type FormulaireProps = {
  projetId: string
  garantieFinanciereEnMois?: number
  action: 'soumettre' | 'enregistrer'
  role: typeof rolesAutorisés[number]
}
const Formulaire = ({ projetId, garantieFinanciereEnMois, action, role }: FormulaireProps) => {
  const [displayForm, showForm] = useState(false)

  return (
    <Dropdown
      design="link"
      isOpen={displayForm}
      changeOpenState={(isOpen) => showForm(isOpen)}
      text={action === 'soumettre' ? 'Soumettre une attestation' : `Enregistrer l'attestation`}
    >
      <form
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
        {action === 'enregistrer' && role === 'porteur-projet' && (
          <p className="m-0">
            Il s'agit de l'attestation soumise à la candidature. Cet envoi ne fera pas l'objet d'une
            nouvelle validation dans Potentiel.
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
          <Input type="date" name="expirationDate" id="expirationDate" required />
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
        <div className="flex gap-4 flex-col md:flex-row">
          <Button type="submit">Envoyer</Button>
          <SecondaryButton onClick={() => showForm(false)}>Annuler</SecondaryButton>
        </div>
      </form>
    </Dropdown>
  )
}

type ATraiterProps = ComponentProps & { statut: 'à traiter' }
const ATraiter = ({
  date: dateConstitution,
  url,
  variant,
  project,
  dateEchéance,
}: ATraiterProps) => {
  const utilisateurEstPorteur = variant === 'porteur-projet'
  const utilisateurEstAdmin = variant === 'dreal' || variant === 'admin'
  const modificationAutorisée = utilisateurPeutModifierLesGF(variant)

  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-middle">
            <ItemDate date={dateConstitution} />
          </div>
          <div className="align-middle mb-1">
            <InfoItem message={utilisateurEstAdmin ? 'à traiter' : 'validation en attente'} />
          </div>
        </div>
        <ItemTitle title={'Constitution des garanties financières'} />
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
        {utilisateurEstPorteur && <AnnulerDépôt projetId={project.id} />}
      </ContentArea>
    </>
  )
}

type DateEchéanceProps = {
  projetId: string
  modificationAutorisée: boolean
  dateEchéance: number | undefined
  garantieFinanciereEnMois?: number
}
const DateEchéance = ({
  projetId,
  modificationAutorisée,
  dateEchéance,
  garantieFinanciereEnMois,
}: DateEchéanceProps) => {
  return (
    <>
      <div>
        {dateEchéance && <p className="m-0">Date d'échéance : {formatDate(dateEchéance)}</p>}
        {modificationAutorisée && (
          <DateEchéanceFormulaire
            projetId={projetId}
            garantieFinanciereEnMois={garantieFinanciereEnMois}
            action={dateEchéance ? 'Éditer' : 'Ajouter'}
          />
        )}
      </div>
    </>
  )
}

type DateEchéanceFormulaireProps = {
  projetId: string
  garantieFinanciereEnMois?: number
  action: 'Éditer' | 'Ajouter'
}
const DateEchéanceFormulaire = ({
  projetId,
  garantieFinanciereEnMois,
  action,
}: DateEchéanceFormulaireProps) => {
  const [displayForm, showForm] = useState(false)
  return (
    <Dropdown
      design="link"
      text={`${action} la date d'échéance`}
      isOpen={displayForm}
      changeOpenState={(isOpen) => showForm(isOpen)}
    >
      <form
        action={ROUTES.ADD_GF_EXPIRATION_DATE({ projectId: projetId })}
        method="POST"
        className="mt-2 border border-solid border-gray-300 rounded-md p-5 flex flex-col gap-3"
      >
        <FormulaireChampsObligatoireLégende className="ml-auto" />
        <input name="projectId" value={projetId} readOnly hidden />
        <Label htmlFor="expirationDate" required>
          Date d'échéance des garanties financières
          <Astérisque className="text-black" />
        </Label>
        <Input required type="date" name="expirationDate" id="expirationDate" />
        <p className="italic">
          <Astérisque className="text-black" /> À noter : {getInfoDuréeGF(garantieFinanciereEnMois)}
        </p>
        <div className="flex gap-4 flex-col md:flex-row">
          <Button type="submit">Enregistrer</Button>
          <SecondaryButton onClick={() => showForm(false)}>Annuler</SecondaryButton>
        </div>
      </form>
    </Dropdown>
  )
}

type AnnulerDépôtProps = {
  projetId: string
}
const AnnulerDépôt = ({ projetId }: AnnulerDépôtProps) => (
  <Link
    href={ROUTES.REMOVE_GARANTIES_FINANCIERES({
      projectId: projetId,
    })}
    data-confirm="Êtes-vous sur de vouloir annuler le dépôt et supprimer l'attestion jointe ?"
  >
    Annuler le dépôt
  </Link>
)

type ValidéProps = ComponentProps & { statut: 'validé' }
const Validé = ({
  date: dateConstitution,
  url,
  dateEchéance,
  variant,
  envoyéesPar,
  retraitDépôtPossible,
  project,
}: ValidéProps) => {
  const utilisateurEstPorteur = variant === 'porteur-projet'
  const utilisateurEstAdmin = variant === 'dreal' || variant === 'admin'
  const modificationAutorisée = utilisateurPeutModifierLesGF(variant)

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
        {retraitDépôtPossible &&
          ((utilisateurEstPorteur && envoyéesPar === 'porteur-projet') || utilisateurEstAdmin) && (
            <RetirerDocument projetId={project.id} envoyéesPar={envoyéesPar} />
          )}
        {envoyéesPar === 'dreal' && (
          <p className="m-0 italic">Ce document a été ajouté par la DREAL</p>
        )}
        {envoyéesPar === 'admin' && (
          <p className="m-0 italic">Ce document a été ajouté par la DGEC</p>
        )}
      </ContentArea>
    </>
  )
}

type RetirerDocumentProps = {
  projetId: string
  envoyéesPar?: 'porteur-projet' | 'dreal' | 'admin'
}
const RetirerDocument = ({ projetId, envoyéesPar }: RetirerDocumentProps) => (
  <p className="p-0 m-0">
    <Link
      href={ROUTES.WITHDRAW_GARANTIES_FINANCIERES({
        projectId: projetId,
      })}
      data-confirm="Êtes-vous sur de vouloir retirer l'attestion jointe ?"
    >
      Retirer le document de Potentiel
    </Link>
    {envoyéesPar === 'porteur-projet' && (
      <span> (cela n'annule pas les garanties financières soumises à la candidature)</span>
    )}
  </p>
)
