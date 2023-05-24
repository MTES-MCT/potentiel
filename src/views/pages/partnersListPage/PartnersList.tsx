import { Request } from 'express';
import React from 'react';
import { User } from '@entities';
import ROUTES from '@routes';
import {
  PrimaryButton,
  Input,
  LegacyPageTemplate,
  Select,
  SuccessBox,
  ErrorBox,
  Heading1,
  Heading2,
  ListeVide,
  Label,
  FormulaireChampsObligatoireLégende,
  Table,
  Td,
  Th,
  Form,
} from '@components';
import { hydrateOnClient } from '../../helpers';

type PartnersListProps = {
  request: Request;
  users: Array<User>;
  validationErrors?: Array<{ [fieldName: string]: string }>;
};

export const PartnersList = ({ request, users, validationErrors }: PartnersListProps) => {
  const { error, success } = (request.query as any) || {};

  return (
    <LegacyPageTemplate user={request.user} currentPage="admin-users">
      <Heading1>Gérer les utilisateurs partenaires</Heading1>
      <Heading2>Ajouter un utilisateur</Heading2>
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}
      <Form action={ROUTES.ADMIN_INVITE_USER_ACTION} method="post" className="mx-auto">
        <FormulaireChampsObligatoireLégende className="text-right" />
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
          <Label htmlFor="role" required>
            Sélectionnez un rôle
          </Label>
          <Select
            name="role"
            id="role"
            required
            {...(validationErrors && { error: validationErrors['role']?.toString() })}
            defaultValue="default"
          >
            <option value="default" disabled hidden>
              Sélectionnez un rôle
            </option>
            <option value="acheteur-obligé">Acheteur obligé</option>
            <option value="ademe">ADEME</option>
            <option value="cre">CRE</option>
            <option value="caisse-des-dépôts">Caisse des dépôts</option>
          </Select>
        </div>
        <PrimaryButton className="m-auto" type="submit" id="submit">
          Inviter
        </PrimaryButton>
      </Form>

      {users.length === 0 ? (
        <ListeVide titre="Aucun partenaire à afficher" />
      ) : (
        <>
          <Heading2>Liste des utilisateurs</Heading2>
          <Table>
            <thead>
              <tr>
                <Th>Nom (email)</Th>
                <Th>Role</Th>
              </tr>
            </thead>
            <tbody>
              {users.map(({ id, fullName, email, role }) => (
                <tr key={`user_${id}`}>
                  <Td valign="top">
                    {fullName} ({email})
                  </Td>
                  <Td valign="top">{role}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(PartnersList);
