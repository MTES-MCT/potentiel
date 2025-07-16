import { CustomErrorPage } from '@/app/error/CustomError.page';

export default async function PageIntrouvable() {
  return <CustomErrorPage statusCode="404" type="NotFoundError" />;
}
