import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, INLINES, MARKS, type Block, type Inline } from '@contentful/rich-text-types'; // <--- Agregamos INLINES y MARKS
import type { Asset as ContentfulAsset } from 'contentful'; 
import type { Document } from '@contentful/rich-text-types';

// ... (TUS INTERFACES SE MANTIENEN IGUAL) ...
export interface ContentfulPostFields {
  title: string;
  slug: string;
  publishedDate: string;
  image?: ContentfulAsset;
  alt?: string;
  duration: string;
  excerpt: string;
  tags?: string[];
  contenido?: Document;
  fuentes?: Document;
}

export interface CleanPost {
  title: string;
  slug: string;
  publishedDate: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  duration: string;
  excerpt: string;
  tags: string[];
  fullContentHTML: string;
  fuentesHTML: string;
}

// --- OPCIONES DE RENDERIZADO MEJORADAS ---
const mainContentOptions = {
  renderMark: {
    // 1. CÓDIGO INLINE: Para cuando escribas nombres de variables o comandos
    [MARKS.CODE]: (text: string) => {
      return `<code style="background: #f4f4f4; padding: 2px 5px; border-radius: 4px; font-family: monospace;">${text}</code>`;
    },
    // 2. NEGRITAS: Aseguramos que use tu clase o etiqueta preferida (opcional, strong suele bastar)
    [MARKS.BOLD]: (text: string) => `<strong>${text}</strong>`,
  },
  renderNode: {
    // 3. TABLAS (Ya lo tenías)
    [BLOCKS.TABLE]: (node: Block | Inline, next: (nodes: any) => string) => {
      const blockNode = node as Block; 
      return `<div class="table-wrapper"><table>${next(blockNode.content)}</table></div>`;
    },
    
    // 4. CITAS (BLOCKQUOTES)
    // Aseguramos que el contenido dentro del quote se procese bien
    [BLOCKS.QUOTE]: (node: Block | Inline, next: (nodes: any) => string) => {
      const blockNode = node as Block;
      return `<blockquote>${next(blockNode.content)}</blockquote>`;
    },

    // 5. IMÁGENES (Ya lo tenías, mantenemos la lógica)
    [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => {
      const blockNode = node as Block;
      const target = blockNode.data.target;
      if (!target || !target.fields || !target.fields.file) return ''; 

      const { file, title, description } = target.fields;
      const url = file.url.startsWith('//') ? `https:${file.url}` : file.url;
      const altText = description || title || 'Imagen del artículo';
      
      // Filtro extra: Solo renderizar si es imagen (por si subes un PDF por error)
      if (!file.contentType.includes('image')) return '';

      return `
        <figure class="embedded-asset">
          <img 
            src="${url}" 
            alt="${altText}" 
            width="${file.details?.image?.width || 'auto'}"
            height="${file.details?.image?.height || 'auto'}"
            loading="lazy"
          />
          ${description ? `<figcaption>${description}</figcaption>` : ''}
        </figure>
      `;
    },

    // 6. ENLACES INTELIGENTES (NUEVO E IMPORTANTE)
    [INLINES.HYPERLINK]: (node: Block | Inline, next: (nodes: any) => string) => {
      const inlineNode = node as Inline;
      const url = inlineNode.data.uri;
      const text = next(inlineNode.content);

      // Si el link empieza con http/https, es externo: abrir en nueva pestaña
      if (url.startsWith('http')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
      // Si no, es interno: comportamiento normal
      return `<a href="${url}">${text}</a>`;
    }
  }
};

const basicRenderOptions = {};

// ... (TU FUNCIÓN transformPost SE MANTIENE IGUAL) ...
export function transformPost(fields: ContentfulPostFields): CleanPost {
  const file = fields.image?.fields?.file;
  const imageUrl = file?.url ? `https:${file.url}` : '/images/blogs/default-social.webp';

  let imageWidth = 1200;
  let imageHeight = 630;

  if (file && 'image' in (file.details ?? {})) {
    const imageDetails = (file.details as { image: { width: number; height: number } }).image;
    imageWidth = imageDetails.width;
    imageHeight = imageDetails.height;
  }

  return {
    slug: fields.slug ?? '',
    title: fields.title ?? 'Sin Título',
    publishedDate: fields.publishedDate ?? new Date().toISOString(),
    duration: fields.duration ?? 'N/A',
    excerpt: fields.excerpt ?? '',
    
    image: imageUrl,
    imageWidth: imageWidth,
    imageHeight: imageHeight,
    alt: fields.alt ?? fields.title ?? 'Imagen de post',

    tags: fields.tags ?? [],

    fullContentHTML: fields.contenido 
      ? documentToHtmlString(fields.contenido, mainContentOptions) 
      : '<p>Contenido no disponible.</p>',
    
    fuentesHTML: fields.fuentes
      ? documentToHtmlString(fields.fuentes, basicRenderOptions)
      : '',
  };
}