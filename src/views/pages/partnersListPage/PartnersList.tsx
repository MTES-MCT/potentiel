import { Request } from 'express';
import React from 'react';
import { User } from '@entities';
import { dataId } from '../../../helpers/testId';
import ROUTES from '@routes';
import {
  Button,
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
      <div className="panel">
        <div className="panel__header">
          <Heading1>Gérer les utilisateurs partenaires</Heading1>
        </div>
        <div className="panel__header">
          <Heading2>Ajouter un utilisateur</Heading2>
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}
          <form
            action={ROUTES.ADMIN_INVITE_USER_ACTION}
            method="post"
            className="flex flex-col gap-4"
          >
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
            <Button className="m-auto" type="submit" id="submit" {...dataId('submit-button')}>
              Inviter
            </Button>
          </form>
        </div>

        {users.length === 0 ? (
          <ListeVide titre="Aucun partenaire à afficher" />
        ) : (
          <>
            <Heading2>Liste des utilisateurs</Heading2>
            <table className="table" {...dataId('projectList-list')}>
              <thead>
                <tr>
                  <th>Nom (email)</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(({ id, fullName, email, role }) => {
                  return (
                    <tr key={'user_' + id} {...dataId('userList-item')}>
                      <td valign="top">
                        {fullName} ({email})
                      </td>
                      <td valign="top">{role}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(PartnersList);
