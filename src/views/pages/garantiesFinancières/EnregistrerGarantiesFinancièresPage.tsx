import React, { useState } from 'react';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
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
} from '@components';
import { ConsulterProjetReadModel, GarantiesFinancièresReadModel } from '@potentiel/domain-views';
import routes from '@routes';
import { formatDateForInput, hydrateOnClient } from '../../helpers';
import { TitreGarantiesFinancières } from './components/TitreGarantiesFinancières';

type EnregistrerGarantiesFinancièresProps = {
  user: UtilisateurReadModel;
  projet: ConsulterProjetReadModel;
  garantiesFinancières?: GarantiesFinancièresReadModel;
  error?: string;
};

export const EnregistrerGarantiesFinancières = ({
  user,
  projet,
  garantiesFinancières,
  error,
}: EnregistrerGarantiesFinancièresProps) => {
  const { identifiantProjet } = projet;
  const [typeSélectionné, sélectionnerType] = useState(
    (garantiesFinancières?.typeGarantiesFinancières as string) ?? '',
  );
  const [isInfosConstitutionRequired, setInfosConstitutionRequired] = useState(
    garantiesFinancières?.attestationConstitution?.format &&
      garantiesFinancières.attestationConstitution.date
      ? true
      : false,
  );

  return (
    <PageProjetTemplate titre={<TitreGarantiesFinancières />} user={user} résuméProjet={projet}>
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_ENREGISTRER_GARANTIES_FINANCIERES(identifiantProjet)}
        >
          <Heading2>Enregistrer les garanties financières</Heading2>

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
              disabled={
                garantiesFinancières?.typeGarantiesFinancières
                  ? user.role === 'porteur-projet'
                  : false
              }
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
                defaultValue={
                  garantiesFinancières?.dateÉchéance &&
                  formatDateForInput(garantiesFinancières?.dateÉchéance)
                }
                required
                disabled={
                  garantiesFinancières?.dateÉchéance ? user.role === 'porteur-projet' : false
                }
              />
            </div>
          )}

          <div>
            <Label htmlFor="dateConstitution">
              Date de constitution{!isInfosConstitutionRequired && ' (optionnel)'}
            </Label>
            <Input
              type="date"
              id="dateConstitution"
              name="dateConstitution"
              max={new Date().toISOString().split('T').shift()}
              defaultValue={
                garantiesFinancières?.attestationConstitution?.date &&
                formatDateForInput(garantiesFinancières?.attestationConstitution?.date)
              }
              disabled={
                garantiesFinancières?.attestationConstitution?.date
                  ? user.role === 'porteur-projet'
                  : false
              }
              onChange={(e) => {
                e.currentTarget.value && setInfosConstitutionRequired(true);
              }}
              required={isInfosConstitutionRequired}
            />
          </div>

          <div>
            <Label htmlFor="file">
              Attestation de constitution{!isInfosConstitutionRequired && ' (optionnel)'}
            </Label>
            <InputFile
              id="file"
              name="file"
              fileUrl={
                garantiesFinancières?.attestationConstitution?.format
                  ? routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES(identifiantProjet)
                  : undefined
              }
              disabled={
                garantiesFinancières?.attestationConstitution?.format
                  ? user.role === 'porteur-projet'
                  : false
              }
              onFileChange={() => setInfosConstitutionRequired(true)}
              required={
                isInfosConstitutionRequired &&
                !garantiesFinancières?.attestationConstitution?.format
              }
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <PrimaryButton type="submit">Enregistrer</PrimaryButton>
            <Link href={routes.PROJECT_DETAILS(identifiantProjet)} className="m-auto">
              Retour vers le projet
            </Link>
          </div>
        </Form>

        <InfoBox className="flex md:w-1/3 md:mx-auto">
          En transmettant votre attestation de constitution de garanties financières sur Potentiel,
          elle sera directement accessible par la DREAL concernée par votre projet, vous n'avez plus
          à l'envoyer par courrier.
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};

hydrateOnClient(EnregistrerGarantiesFinancières);
