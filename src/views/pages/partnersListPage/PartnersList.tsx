import { Request } from 'express';
import React from 'react';
import { User } from '../../../entities';
import ROUTES from '../../../routes';
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
  Table,
  Td,
  Th,
  Form,
  ChampsObligatoiresLégende,
} from '../../components';
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
        <ChampsObligatoiresLégende />
        <div>
          <Label htmlFor="email">Adresse email :</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="email@exemple.com"
            {...(validationErrors && { error: validationErrors['email']?.toString() })}
            required
            aria-required="true"
          />
        </div>
        <div>
          <Label htmlFor="role">Sélectionnez un rôle :</Label>
          <Select
            name="role"
            id="role"
            {...(validationErrors && { error: validationErrors['role']?.toString() })}
            defaultValue=""
            required
            aria-required="true"
          >
            <option value="">Sélectionnez un rôle</option>
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
                  <Td className="align-top">
                    {fullName} ({email})
                  </Td>
                  <Td className="align-top">{role}</Td>
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
