import { Request } from 'express';
import React from 'react';
import { dataId } from '../../../helpers/testId';
import ROUTES from '@routes';
import {
  Button,
  ErrorBox,
  Heading1,
  Heading2,
  Input,
  ListeVide,
  PageTemplate,
  Select,
  SuccessBox,
  Label,
  FormulaireChampsObligatoireLégende,
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
    <PageTemplate user={request.user} currentPage="list-dreal">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Gérer les Région</Heading1>
        </div>
        <div className="panel__header">
          <Heading2>Ajouter un utilisateur Région</Heading2>

          <form
            action={ROUTES.ADMIN_INVITE_DREAL_USER_ACTION}
            method="post"
            className="flex flex-col gap-4"
          >
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
            <Button type="submit" id="submit" {...dataId('submit-button')} className="m-auto">
              Inviter
            </Button>
          </form>
        </div>
        {users.length === 0 ? (
          <ListeVide titre="Aucun utilisateur dreal à afficher" />
        ) : (
          <>
            <Heading2>Les utilisateurs rattachés à une région</Heading2>
            <table className="table" {...dataId('projectList-list')}>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Région(s)</th>
                </tr>
              </thead>
              <tbody>
                {users.map(({ user, dreals }, index) => {
                  return (
                    <tr key={'user_' + index} {...dataId('drealList-item')}>
                      <td valign="top">
                        {user.fullName} ({user.email})
                      </td>
                      <td valign="top">{dreals.join(', ')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </PageTemplate>
  );
};

hydrateOnClient(DrealList);
