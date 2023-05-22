import { Request } from 'express';
import React from 'react';
import { dataId } from '../../../helpers/testId';
import ROUTES from '@routes';
import {
  PrimaryButton,
  ErrorBox,
  Heading1,
  Heading2,
  Input,
  ListeVide,
  LegacyPageTemplate,
  Select,
  SuccessBox,
  Label,
  FormulaireChampsObligatoireLégende,
  Table,
  Td,
  Th,
  Form,
} from '@components';
import { hydrateOnClient } from '../../helpers/hydrateOnClient';
import { REGIONS, Région } from '@modules/dreal/région';

type DrealListProps = {
  request: Request;
  users: Array<{ user: { email: string; fullName: string }; dreals: Array<Région> }>;
  validationErrors?: Array<{ [fieldName: string]: string }>;
};

export const DrealList = ({ request, users, validationErrors }: DrealListProps) => {
  const { success, error } = (request.query as any) || {};
  return (
    <LegacyPageTemplate user={request.user} currentPage="list-dreal">
      <Heading1>Gérer les régions</Heading1>
      <Heading2>Ajouter un utilisateur région</Heading2>

      <Form action={ROUTES.ADMIN_INVITE_DREAL_USER_ACTION} method="post" className="mx-auto">
        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}
        <FormulaireChampsObligatoireLégende className="text-right" />
        <input type="hidden" name="role" value="dreal" />
        <div>
          <Label htmlFor="email" required>
            Adresse email :
          </Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="email@exemple.com"
            required
            {...(validationErrors && { error: validationErrors['email']?.toString() })}
          />
        </div>
        <div>
          <Label htmlFor="region" required>
            Sélectionnez une région
          </Label>
          <Select
            name="region"
            id="region"
            required
            {...(validationErrors && { error: validationErrors['region']?.toString() })}
            defaultValue="default"
          >
            <option value="default" disabled hidden>
              Sélectionnez une région
            </option>
            {[...REGIONS]
              .sort((a, b) => a.localeCompare(b))
              .map((value, index) => (
                <option key={`${value}_${index}`} value={value}>
                  {value}
                </option>
              ))}
          </Select>
        </div>
        <PrimaryButton type="submit" id="submit" className="m-auto">
          Inviter
        </PrimaryButton>
      </Form>
      {users.length === 0 ? (
        <ListeVide titre="Aucun utilisateur dreal à afficher" />
      ) : (
        <>
          <Heading2>Les utilisateurs rattachés à une région</Heading2>
          <Table>
            <thead>
              <tr>
                <Th>Utilisateur</Th>
                <Th>Région(s)</Th>
              </tr>
            </thead>
            <tbody>
              {users.map(({ user, dreals }, index) => {
                return (
                  <tr key={'user_' + index} {...dataId('drealList-item')}>
                    <Td valign="top">
                      {user.fullName} ({user.email})
                    </Td>
                    <Td valign="top">{dreals.join(', ')}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(DrealList);
