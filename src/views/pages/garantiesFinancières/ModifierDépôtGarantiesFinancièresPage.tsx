import React, { useState } from 'react';
import {
  PrimaryButton,
  Heading2,
  Input,
  InputFile,
  Label,
  Link,
  PageProjetTemplate,
  Form,
  InfoBox,
  Select,
  ErrorBox,
} from '../../components';
import { DépôtGarantiesFinancièresReadModel, ProjetReadModel } from '@potentiel/domain-views';
import routes from '../../../routes';
import { formatDateForInput, formatDateForInputMaxDate, hydrateOnClient } from '../../helpers';
import { TitreGarantiesFinancières } from './components/TitreGarantiesFinancières';
import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';

type ModifierDépôtGarantiesFinancièresProps = {
  user: UtilisateurReadModel;
  projet: ProjetReadModel;
  dépôt?: DépôtGarantiesFinancièresReadModel;
  error?: string;
};

export const ModifierDépôtGarantiesFinancières = ({
  user,
  projet,
  error,
  dépôt,
}: ModifierDépôtGarantiesFinancièresProps) => {
  const { identifiantProjet } = projet;
  const [typeSélectionné, sélectionnerType] = useState(dépôt?.typeGarantiesFinancières || '');

  return (
    <PageProjetTemplate titre={<TitreGarantiesFinancières />} user={user} résuméProjet={projet}>
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_MODIFIER_DEPOT_GARANTIES_FINANCIERES(identifiantProjet)}
        >
          <Heading2>Modifier des garanties financières déposées</Heading2>

          <p className="text-sm italic m-0">
            Sauf mention contraire “(optionnel)” dans le label, tous les champs sont obligatoires
          </p>

          {error && <ErrorBox>{error}</ErrorBox>}

          <div>
            <Label htmlFor="typeGarantiesFinancieres">Type des garanties financières</Label>
            <Select
              id="typeGarantiesFinancieres"
              name="typeGarantiesFinancieres"
              defaultValue={typeSélectionné}
              onChange={(e) => sélectionnerType(e.currentTarget.value)}
              required
            >
              <option value="">Sélectionnez un type de garanties financières</option>
              <option value="6 mois après achèvement" key="6 mois après achèvement">
                6 mois après achèvement
              </option>
              <option value="consignation" key="consignation">
                Consignation
              </option>
              <option value="avec date d'échéance" key="avec date d'échéance">
                Avec date d'échéance
              </option>
            </Select>
          </div>

          {typeSélectionné === `avec date d'échéance` && (
            <div>
              <Label htmlFor="dateEcheance">Date d'échéance</Label>
              <Input
                type="date"
                id="dateEcheance"
                name="dateEcheance"
                required
                defaultValue={dépôt?.dateÉchéance && formatDateForInput(dépôt?.dateÉchéance)}
              />
            </div>
          )}

          <div>
            <Label htmlFor="dateConstitution">Date de constitution</Label>
            <Input
              type="date"
              id="dateConstitution"
              name="dateConstitution"
              max={formatDateForInputMaxDate(new Date())}
              defaultValue={
                dépôt?.attestationConstitution.date &&
                formatDateForInput(dépôt?.attestationConstitution.date)
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="file">
              Attestation de constitution{' '}
              {dépôt?.attestationConstitution.format && <span>(optionnel)</span>}
            </Label>
            <InputFile
              id="file"
              name="file"
              required={!dépôt?.attestationConstitution.format}
              fileUrl={routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES_DEPOT(
                identifiantProjet,
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <PrimaryButton type="submit">Soumettre</PrimaryButton>
            <Link href={routes.PROJECT_DETAILS(identifiantProjet)} className="m-auto">
              Retour vers le projet
            </Link>
          </div>
        </Form>

        <InfoBox className="flex md:w-1/3 md:mx-auto">
          Vous pouvez modifier ce dépôt jusqu'à sa validation par la DREAL concernée.
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};

hydrateOnClient(ModifierDépôtGarantiesFinancières);
