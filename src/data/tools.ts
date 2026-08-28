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
export const tools = [
  { slug:'json-formatter', category:'developer' as CategorySlug, name:'JSON Formatter', description:'Format, minify, validate, copy, and download JSON without sending it anywhere.', path:'/developer/json-formatter/' },
  { slug:'jwt-decoder', category:'developer' as CategorySlug, name:'JWT Decoder', description:'Decode JWT header and payload locally without verifying signatures.', path:'/developer/jwt-decoder/' },
  { slug:'base64-encoder', category:'developer' as CategorySlug, name:'Base64 Encoder', description:'Encode and decode UTF-8 text as Base64 entirely in your browser.', path:'/developer/base64-encoder/' },
  { slug:'uuid-generator', category:'developer' as CategorySlug, name:'UUID Generator', description:'Generate UUID v4 identifiers in bulk, then copy or download them.', path:'/developer/uuid-generator/' },
  { slug:'regex-tester', category:'developer' as CategorySlug, name:'Regex Tester', description:'Test regular expressions with flags, match highlights, and capture groups.', path:'/developer/regex-tester/' },
  { slug:'cron-generator', category:'developer' as CategorySlug, name:'Cron Generator', description:'Build a 5-field Unix cron expression and see the next run times.', path:'/developer/cron-generator/' },
  { slug:'sql-formatter', category:'developer' as CategorySlug, name:'SQL Formatter', description:'Format and minify SQL in your browser, then copy or download it.', path:'/developer/sql-formatter/' },
] as const;
export const getToolsForCategory = (slug:string) => tools.filter((tool) => tool.category === slug);
