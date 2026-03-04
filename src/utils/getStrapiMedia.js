export function getStrapiMedia(url) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

    if (url == null) {
      return null;
    }
  
    // Return the full URL if the path is already an absolute URL
    if (url.startsWith('https://') || url.startsWith('http://')) {
      return url;
    }
  
    // Otherwise, prepend the Strapi API URL
    return `${baseUrl}${url}`;
  }