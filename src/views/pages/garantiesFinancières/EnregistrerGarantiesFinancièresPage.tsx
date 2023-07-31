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
} from '@components';
import { ConsulterProjetReadModel, GarantiesFinancièresReadModel } from '@potentiel/domain-views';
import routes from '@routes';
import { hydrateOnClient } from '../../helpers';
import { TitreGarantiesFinancières } from './components/TitreGarantiesFinancières';

type EnregistrerGarantiesFinancièresProps = {
  user: UtilisateurReadModel;
  projet: ConsulterProjetReadModel;
  garantieFinancière?: GarantiesFinancièresReadModel;
};

export const EnregistrerGarantiesFinancières = ({
  user,
  projet,
  garantieFinancière,
}: EnregistrerGarantiesFinancièresProps) => {
  const { identifiantProjet } = projet;
  const [typeSélectionné, sélectionnerType] = useState('');

  return (
    <PageProjetTemplate titre={<TitreGarantiesFinancières />} user={user} résuméProjet={projet}>
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_ENREGISTRER_GARANTIES_FINANCIERES(identifiantProjet)}
        >
          <Heading2>Enregistrer la garantie financière</Heading2>

          <p className="text-sm italic m-0">Tous les champs sont obligatoires</p>

          {/* {error && <ErrorBox>{error}</ErrorBox>} */}

          <div>
            <Label htmlFor="identifiantGestionnaireReseau">Type de la garantie financière</Label>
            <Select
              defaultValue={garantieFinancière?.typeGarantiesFinancières ?? ''}
              onChange={(e) => sélectionnerType(e.currentTarget.value)}
              required
              disabled={
                garantieFinancière?.typeGarantiesFinancières
                  ? user.role === 'porteur-projet'
                  : false
              }
            >
              <option value="">Sélectionnez un type de garantie financière</option>
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
              <Label htmlFor="dateEcheance">Date d'échéance *</Label>
              <Input
                type="date"
                id="dateEcheance"
                name="dateEcheance"
                defaultValue={garantieFinancière?.dateÉchéance}
                required
                disabled={garantieFinancière?.dateÉchéance ? user.role === 'porteur-projet' : false}
              />
            </div>
          )}

          <div>
            <Label htmlFor="dateConstitution">Date de constitution</Label>
            <Input
              type="date"
              id="dateConstitution"
              name="dateConstitution"
              defaultValue={garantieFinancière?.attestationConstitution?.date}
              required
              disabled={
                garantieFinancière?.attestationConstitution?.date
                  ? user.role === 'porteur-projet'
                  : false
              }
            />
          </div>

          <div>
            <Label htmlFor="file">Attestation de constitution</Label>
            <InputFile
              id="file"
              name="file"
              fileUrl={
                garantieFinancière?.attestationConstitution
                  ? routes.GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES(identifiantProjet)
                  : undefined
              }
              required
              disabled={
                garantieFinancière?.attestationConstitution ? user.role === 'porteur-projet' : false
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
          elle sera directement accessible par la DREAL concernée par votre projetEn transmettant
          votre attestation de constitution de garanties financières sur Potentiel, elle sera
          directement accessible par la DREAL concernée par votre projet.
          <br />
          <br />
          Vous n'avez plus à l'envoyer par courrier
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};

hydrateOnClient(EnregistrerGarantiesFinancières);
