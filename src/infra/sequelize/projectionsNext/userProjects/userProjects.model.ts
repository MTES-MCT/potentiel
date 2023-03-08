import { InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { User } from '../users/users.model';

export class UserProjects extends Model<
  InferAttributes<UserProjects>,
  InferCreationAttributes<UserProjects>
> {
  userId: string;
  projectId: string;
  user: NonAttribute<User>;
}
