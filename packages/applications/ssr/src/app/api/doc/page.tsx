import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export const dynamic = 'force-dynamic';

export default function SwaggerPage() {
  return <SwaggerUI url="/api/openapi" />;
}
