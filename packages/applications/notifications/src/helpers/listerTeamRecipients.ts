export const listerTeamRecipients = () => {
  const teamEmail = process.env.TEAM_EMAIL;
  if (!teamEmail) {
    throw new Error('TEAM_EMAIL non défini');
  }
  return [{ email: teamEmail }];
};
