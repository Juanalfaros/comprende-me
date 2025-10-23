import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, type Block, type Inline, type Node as ContentfulNode } from '@contentful/rich-text-types'; 
import type { Asset as ContentfulAsset } from 'contentful';
import type { Document } from '@contentful/rich-text-types';

// --- 1. INTERFACES (NUESTROS CONTRATOS) ---
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

// --- 2. OPCIONES DE RENDERIZADO (PARA LA TABLA) ---
const tableOptions = {
  renderNode: {
    [BLOCKS.TABLE]: (node: Block | Inline, next: (nodes: any) => string) => {
      const blockNode = node as Block; 
      return `<div class="table-wrapper"><table>${next(blockNode.content)}</table></div>`;
    }
  }
};

const basicRenderOptions = {};

// --- 3. FUNCIÓN DE TRANSFORMACIÓN (LA MAGIA) ---
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
      ? documentToHtmlString(fields.contenido, tableOptions) 
      : '<p>Contenido no disponible.</p>',
    
    fuentesHTML: fields.fuentes
      ? documentToHtmlString(fields.fuentes, basicRenderOptions)
      : '',
  };
}
