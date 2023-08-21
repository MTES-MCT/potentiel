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
  ChampsObligatoiresLégende,
} from '../../components';
import { ProjetReadModel } from '@potentiel/domain-views';
import routes from '../../../routes';
import { formatDateForInputMaxDate, hydrateOnClient } from '../../helpers';
import { TitreGarantiesFinancières } from './components/TitreGarantiesFinancières';
import { UtilisateurReadModel } from '../../../modules/utilisateur/récupérer/UtilisateurReadModel';

type DéposerGarantiesFinancièresProps = {
  user: UtilisateurReadModel;
  projet: ProjetReadModel;
  error?: string;
};

export const DéposerGarantiesFinancières = ({
  user,
  projet,
  error,
}: DéposerGarantiesFinancièresProps) => {
  const { identifiantProjet } = projet;
  const [typeSélectionné, sélectionnerType] = useState('');

  return (
    <PageProjetTemplate titre={<TitreGarantiesFinancières />} user={user} résuméProjet={projet}>
      <div className="flex flex-col md:flex-row gap-4">
        <Form
          className="max-w-none w-full md:w-1/2 mx-0"
          method="POST"
          encType="multipart/form-data"
          action={routes.POST_DEPOSER_GARANTIES_FINANCIERES(identifiantProjet)}
        >
          <Heading2>Déposer de nouvelles garanties financières</Heading2>

          <ChampsObligatoiresLégende />

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
              <Input type="date" id="dateEcheance" name="dateEcheance" required />
            </div>
          )}

          <div>
            <Label htmlFor="dateConstitution">Date de constitution</Label>
            <Input
              type="date"
              id="dateConstitution"
              name="dateConstitution"
              max={formatDateForInputMaxDate(new Date())}
              required
            />
          </div>

          <div>
            <Label htmlFor="file">Attestation de constitution</Label>
            <InputFile id="file" name="file" required />
          </div>

          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <PrimaryButton type="submit">Soumettre</PrimaryButton>
            <Link href={routes.PROJECT_DETAILS(identifiantProjet)} className="m-auto">
              Retour vers le projet
            </Link>
          </div>
        </Form>

        <InfoBox className="flex md:w-1/3 md:mx-auto">
          Une fois les garanties financières déposées dans Potentiel, la DREAL concernée recevra une
          notification l'invitation vérifier leur conformité. Vous serez à votre tour notifié à la
          validation des garanties financières.
        </InfoBox>
      </div>
    </PageProjetTemplate>
  );
};

hydrateOnClient(DéposerGarantiesFinancières);
