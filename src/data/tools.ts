export const categories = [
  { slug: 'developer', name: 'Developer', description: 'Format, validate, and inspect code and data.' },
  { slug: 'finance', name: 'Finance', description: 'Practical calculators for everyday money decisions.' },
  { slug: 'converters', name: 'Converters', description: 'Convert common units and file-friendly values.' },
  { slug: 'seo-tools', name: 'SEO Tools', description: 'Check and prepare content for search engines.' },
  { slug: 'text-tools', name: 'Text Tools', description: 'Clean, count, compare, and transform text.' },
  { slug: 'generators', name: 'Generators', description: 'Generate useful values and ready-to-use snippets.' },
  { slug: 'estimators', name: 'Estimators', description: 'Make quick, transparent everyday estimates.' },
] as const;
export type CategorySlug = (typeof categories)[number]['slug'];
export const tools = [{ slug:'json-formatter', category:'developer' as CategorySlug, name:'JSON Formatter', description:'Format, minify, validate, copy, and download JSON without sending it anywhere.', path:'/developer/json-formatter/' }] as const;
export const getToolsForCategory = (slug:string) => tools.filter((tool) => tool.category === slug);
