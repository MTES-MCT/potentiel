import React, { useState } from 'react';

import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';
import {
  PrimaryButton,
  ErrorBox,
  Heading2,
  Input,
  Label,
  PageProjetTemplate,
  Form,
  Select,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import { ConsulterProjetReadModel } from '@potentiel/domain-views';

type GarantiesFinancièresData = { dateConstitution?: number; type?: string; dateEcheance?: number };

type FormulaireGarantiesFinancieresProps = {
  user: UtilisateurReadModel;
  projet: ConsulterProjetReadModel;
  garantiesFinancières?: GarantiesFinancièresData;
  error?: string;
};

export const FormulaireGarantiesFinancieres = ({
  user,
  error,
  projet,
  garantiesFinancières,
}: FormulaireGarantiesFinancieresProps) => {
  const handleTypeSelected = (event) => {
    console.log('TYPE : ', event);
    if (type === "Garantie financière avec date d'échéance et à renouveler") {
      setdisplayDateEcheanceInput(true);
    }
  };

  const [displayDateEcheanceInput, setdisplayDateEcheanceInput] = useState(false);

  return (
    <PageProjetTemplate titre="Garanties financières" user={user} résuméProjet={projet}>
      <Heading2 className="mb-0">Transmettre des garanties financières</Heading2>

      <div className="flex flex-col md:flex-row gap-4">
        <Form className="mx-auto mt-6" method="POST" action={''}>
          {error && <ErrorBox>{error}</ErrorBox>}

          <div>
            <Label htmlFor="stepDate">Date de constitution</Label>
            <Input
              type="date"
              id="stepDate"
              name="stepDate"
              defaultValue={
                garantiesFinancières?.dateConstitution &&
                new Date(garantiesFinancières?.dateConstitution).toDateString()
              }
              max={new Date().toISOString().split('T').shift()}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              name="type"
              defaultValue={garantiesFinancières?.type || ''}
              required
              onChange={(event) => handleTypeSelected(event)}
            >
              <option value="">Sélectionnez un type</option>
              <option value={"Garantie financière jusqu'à 6 mois après la date d'achèvement"}>
                Garantie financière jusqu'à 6 mois après la date d'achèvement
              </option>
              <option value={"Garantie financière avec date d'échéance et à renouveler"}>
                Garantie financière avec date d'échéance et à renouveler
              </option>
              <option value={'Consignation'}>Consignation</option>
            </Select>
          </div>

          {displayDateEcheanceInput && (
            <div>
              <Label htmlFor="dateEcheance">Date d'échéance</Label>
              <Input
                type="date"
                id="dateEcheance"
                name="dateEcheance"
                defaultValue={
                  garantiesFinancières?.dateEcheance &&
                  new Date(garantiesFinancières?.dateEcheance).toDateString()
                }
                max={new Date().toISOString().split('T').shift()}
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="attestation">Attestation de constitution</Label>
            <Input type="file" id="attestation" name="attestation" required />
          </div>

          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <PrimaryButton type="submit">Transmettre</PrimaryButton>
          </div>
        </Form>
      </div>
    </PageProjetTemplate>
  );
};
hydrateOnClient(FormulaireGarantiesFinancieres);
