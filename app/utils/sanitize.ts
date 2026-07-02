export const sanitizeFileName = (name: string) => {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Sonderzeichen durch _ ersetzen
    .replace(/\s+/g, '_'); // Leerzeichen durch _ ersetzen
};