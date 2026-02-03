import axios from 'axios';
import { parseStringPromise } from 'xml2js';

// Base API client
export const api = axios.create({
  baseURL: `${process.env.PRESTASHOP_URL}/api`,
  params: {
    ws_key: process.env.PRESTASHOP_API_KEY
  }
});

// XML Parser utility
export async function parseXML(data: string) {
  const result = await parseStringPromise(data, {
    explicitArray: false,
    mergeAttrs: true
  });
  return result;
}

// Helper to extract clean product name
export function extractProductName(nameData: any): string {
  if (!nameData) return 'Unnamed Product';

  if (typeof nameData === 'string') {
    return nameData;
  }

  if (nameData.language) {
    if (Array.isArray(nameData.language)) {
      return nameData.language[0]._ || nameData.language[0];
    }
    return nameData.language._ || nameData.language;
  }

  return 'Unnamed Product';
}

// Helper to build image URL - handles both string and object formats
export function buildImageUrl(productId: string, imageIdData: any): string | null {
  if (!imageIdData) return null;

  // Extract image ID - could be string or object with "_" property
  let imageId: string;

  if (typeof imageIdData === 'string') {
    imageId = imageIdData;
  } else if (typeof imageIdData === 'object' && imageIdData._) {
    imageId = imageIdData._;
  } else {
    return null;
  }

  return `${process.env.PRESTASHOP_URL}/api/images/products/${productId}/${imageId}?ws_key=${process.env.PRESTASHOP_API_KEY}`;
}
