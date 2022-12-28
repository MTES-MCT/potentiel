import { Permission } from '@modules/authN'

export const PermissionConsulterPageInvitationDgecValidateur: Permission = {
  nom: 'inviter-dgec-validateur',
  description: "Consulter la page d'invitation d'un utilisateur dgec-validateur",
}

export const PermissionInviterDgecValidateur: Permission = {
  nom: 'inviter-dgec-validateur-action',
  description: 'Inviter un utilisateur dgec-validateur',
}
