// 1. CAMBIO CLAVE: Usamos 'import * as' para evitar el error de "no default export"
import * as contentful from 'contentful';

export const createClient = (isPreview = false) => {
  const space = import.meta.env.CONTENTFUL_SPACE_ID;
  
  const accessToken = isPreview 
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN 
    : import.meta.env.CONTENTFUL_ACCESS_TOKEN;

  const host = isPreview ? 'preview.contentful.com' : 'cdn.contentful.com';

  if (!space || !accessToken) {
    throw new Error('Faltan variables de entorno de Contentful');
  }

  // Ahora podemos usar contentful.createClient sin problemas
  return contentful.createClient({
    space,
    accessToken,
    host,
  });
};

// Mantenemos una instancia por defecto para usos generales
export const client = createClient(false);