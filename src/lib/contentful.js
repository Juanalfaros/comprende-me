// src/lib/contentful.js
import * as contentful from 'contentful'; // <-- ¡CAMBIO CLAVE AQUÍ!

// Usamos las variables de entorno de Astro
const space = import.meta.env.CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  throw new Error(
    'Las variables de entorno de Contentful no están configuradas.'
  );
}

// Ahora 'contentful' es un objeto que contiene la función 'createClient'
export const client = contentful.createClient({
  space: space,
  accessToken: accessToken,
});