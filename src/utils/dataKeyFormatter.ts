function dataKeyFormatter<T>(obj: Record<string, string | number | boolean | null>): T {
  if (typeof obj !== "object" || !obj) return obj as T;

  const formattedObj: Record<string, string | number | boolean | null> = {};

  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
    formattedObj[camelKey] = obj[key];
  }

  return formattedObj as T;
}

export default dataKeyFormatter;
