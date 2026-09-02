export const categories = [
  { slug: 'developer', name: 'Developer', description: 'Format, validate, and inspect code and data.' },
  { slug: 'finance', name: 'Finance', description: 'Practical calculators for everyday money decisions.' },
  { slug: 'converters', name: 'Converters', description: 'Convert files, encodings, and time values in your browser.' },
  { slug: 'seo-tools', name: 'SEO Tools', description: 'Check and prepare content for search engines.' },
  { slug: 'text-tools', name: 'Text Tools', description: 'Clean, count, compare, and transform text.' },
  { slug: 'generators', name: 'Generators', description: 'Generate useful values and ready-to-use snippets.' },
  { slug: 'estimators', name: 'Estimators', description: 'Make quick, transparent everyday estimates.' },
] as const;
export type CategorySlug = (typeof categories)[number]['slug'];
export const tools = [
  { slug:'json-formatter', category:'developer' as CategorySlug, name:'JSON Formatter', description:'Format, minify, validate, copy, and download JSON without sending it anywhere.', path:'/developer/json-formatter/' },
  { slug:'jwt-decoder', category:'developer' as CategorySlug, name:'JWT Decoder', description:'Decode JWT header and payload locally without verifying signatures.', path:'/developer/jwt-decoder/' },
  { slug:'base64-encoder', category:'converters' as CategorySlug, name:'Base64 Encoder', description:'Encode and decode UTF-8 text as Base64 entirely in your browser.', path:'/converters/base64-encoder/' },
  { slug:'pdf-to-word', category:'converters' as CategorySlug, name:'PDF to Word', description:'Extract selectable PDF text into a Word .docx file in your browser. Scanned pages and complex layouts will not match the original.', path:'/converters/pdf-to-word/' },
  { slug:'pdf-to-jpg', category:'converters' as CategorySlug, name:'PDF to JPG', description:'Convert each PDF page to a JPG image in your browser, then download pages one by one. Nothing is uploaded.', path:'/converters/pdf-to-jpg/' },
  { slug:'merge-pdf', category:'converters' as CategorySlug, name:'Merge PDF', description:'Combine multiple PDFs into one file in your browser. Concatenates pages as-is; nothing is uploaded.', path:'/converters/merge-pdf/' },
  { slug:'compress-pdf', category:'converters' as CategorySlug, name:'Compress PDF', description:'Shrink a PDF in your browser by redrawing pages as JPEG images. Text may become non-selectable. Nothing is uploaded.', path:'/converters/compress-pdf/' },
  { slug:'word-to-pdf', category:'converters' as CategorySlug, name:'Word to PDF', description:'Extract text from a Word .docx into a simple PDF in your browser. Images, columns, and exact layout will not match. Nothing is uploaded.', path:'/converters/word-to-pdf/' },
  { slug:'jpg-to-pdf', category:'converters' as CategorySlug, name:'JPG to PDF', description:'Convert JPG, PNG, and WebP images to a PDF in your browser. Reorder pages, then download images.pdf. Nothing is uploaded.', path:'/converters/jpg-to-pdf/' },
  { slug:'split-pdf', category:'converters' as CategorySlug, name:'Split PDF', description:'Split a PDF in your browser: extract a page range, split every page, or split into chunks of N pages. Nothing is uploaded.', path:'/converters/split-pdf/' },
  { slug:'rotate-pdf', category:'converters' as CategorySlug, name:'Rotate PDF', description:'Rotate a PDF in your browser by 90, 180, or 270 degrees clockwise. All pages or a page range. Nothing is uploaded.', path:'/converters/rotate-pdf/' },
  { slug:'sign-pdf', category:'converters' as CategorySlug, name:'Sign PDF', description:'Stamp a drawn or uploaded signature image onto a PDF page in your browser. Not a legally binding digital signature. Nothing is uploaded.', path:'/converters/sign-pdf/' },
  { slug:'protect-pdf', category:'converters' as CategorySlug, name:'Protect PDF', description:'Add an open password to a PDF in your browser. Already encrypted files fail with a clear error. Nothing is uploaded.', path:'/converters/protect-pdf/' },
  { slug:'watermark-pdf', category:'converters' as CategorySlug, name:'Add Watermark', description:'Add a text or image PDF watermark in your browser. Rotated tiled or centered text, optional PNG or JPG, opacity slider. Nothing is uploaded.', path:'/converters/watermark-pdf/' },
  { slug:'organize-pdf', category:'converters' as CategorySlug, name:'Organize PDF', description:'Reorder or delete PDF pages in your browser, then download organized.pdf. Copies pages as-is; nothing is uploaded.', path:'/converters/organize-pdf/' },
  { slug:'image-compressor', category:'converters' as CategorySlug, name:'Image Compressor', description:'Shrink JPG, PNG, and WebP in your browser by redrawing to canvas. Lossy JPEG by default; optional PNG output. Nothing is uploaded.', path:'/converters/image-compressor/' },
  { slug:'unix-timestamp', category:'converters' as CategorySlug, name:'Unix Timestamp', description:'Convert Unix time to a readable date and back. Seconds or milliseconds, all in your browser.', path:'/converters/unix-timestamp/' },
  { slug:'uuid-generator', category:'generators' as CategorySlug, name:'UUID Generator', description:'Generate UUID v4 identifiers in bulk, then copy or download them.', path:'/generators/uuid-generator/' },
  { slug:'password-generator', category:'generators' as CategorySlug, name:'Password Generator', description:'Generate strong random passwords in your browser with crypto.getRandomValues, then copy or download them.', path:'/generators/password-generator/' },
  { slug:'regex-tester', category:'developer' as CategorySlug, name:'Regex Tester', description:'Test regular expressions with flags, match highlights, and capture groups.', path:'/developer/regex-tester/' },
  { slug:'cron-generator', category:'developer' as CategorySlug, name:'Cron Generator', description:'Build a 5-field Unix cron expression and see the next run times.', path:'/developer/cron-generator/' },
  { slug:'sql-formatter', category:'developer' as CategorySlug, name:'SQL Formatter', description:'Format and minify SQL in your browser, then copy or download it.', path:'/developer/sql-formatter/' },
  { slug:'gst-calculator', category:'finance' as CategorySlug, name:'GST Calculator', description:'Add or extract India GST with 5%, 12%, 18%, or 28% rates, CGST/SGST or IGST, entirely in your browser.', path:'/finance/gst-calculator/' },
  { slug:'emi-calculator', category:'finance' as CategorySlug, name:'EMI Calculator', description:'Estimate monthly EMI, total interest, and total payment for home, car, or personal loans in your browser.', path:'/finance/emi-calculator/' },
  { slug:'sip-calculator', category:'finance' as CategorySlug, name:'SIP Calculator', description:'Estimate SIP maturity value, total invested, and returns for monthly mutual fund investments in your browser.', path:'/finance/sip-calculator/' },
  { slug:'fd-calculator', category:'finance' as CategorySlug, name:'FD Calculator', description:'Estimate fixed deposit maturity value, interest earned, and principal with compounding in your browser.', path:'/finance/fd-calculator/' },
  { slug:'word-counter', category:'text-tools' as CategorySlug, name:'Word Counter', description:'Count words, characters, sentences, paragraphs, and reading time in your browser as you type.', path:'/text-tools/word-counter/' },
] as const;
export const featuredSlugs = ['pdf-to-word', 'gst-calculator', 'sip-calculator', 'sql-formatter'] as const;
export const getToolsForCategory = (slug:string) => tools.filter((tool) => tool.category === slug);
export const getLiveCategories = () => categories.filter((category) => getToolsForCategory(category.slug).length > 0);
export const getFeaturedTools = () => featuredSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter((tool): tool is (typeof tools)[number] => Boolean(tool));
