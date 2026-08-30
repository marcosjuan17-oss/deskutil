const WARN_PAGES=50;
const MAX_PAGES=200;
const MAX_BYTES=40*1024*1024;
const PDFJS_VER="6.2.108";
const PDFJS_BASE="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/"+PDFJS_VER+"/";
const PDFJS_SRC=PDFJS_BASE+"pdf.min.mjs";
const WNAME="pdf.worker.min.mjs";
const PDFJS_WORKER=PDFJS_BASE+WNAME;
let pdfjsLib:any=null;
let docxBlob:Blob|null=null;
let docxName="converted.docx";
const fileInput=document.querySelector<HTMLInputElement>("#pdf-file")!;
const dropZone=document.querySelector<HTMLElement>("#drop-zone")!;
const fileMeta=document.querySelector<HTMLElement>("#file-meta")!;
const convertBtn=document.querySelector<HTMLButtonElement>("#convert")!;
const downloadBtn=document.querySelector<HTMLButtonElement>("#download")!;
const status=document.querySelector<HTMLParagraphElement>("#status")!;
const setStatus=(message:string,kind="")=>{status.textContent=message;status.className=("status "+kind).trim()};
const wait=()=>new Promise<void>((resolve)=>setTimeout(resolve,0));
const crcTable=(()=>{const table=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;table[i]=c>>>0}return table})();
const crc32=(bytes:Uint8Array)=>{let crc=0xFFFFFFFF;for(let i=0;i<bytes.length;i++)crc=crcTable[(crc^bytes[i])&0xFF]^(crc>>>8);return(crc^0xFFFFFFFF)>>>0};
const u16=(n:number)=>new Uint8Array([n&255,(n>>>8)&255]);
const u32=(n:number)=>new Uint8Array([n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]);
const concat=(parts:Uint8Array[])=>{let len=0;for(const part of parts)len+=part.length;const out=new Uint8Array(len);let offset=0;for(const part of parts){out.set(part,offset);offset+=part.length}return out};
const zipStore=(files:{name:string;data:Uint8Array}[])=>{const encoder=new TextEncoder();const locals:Uint8Array[]=[];const centrals:Uint8Array[]=[];let offset=0;for(const file of files){const name=encoder.encode(file.name);const data=file.data;const crc=crc32(data);const local=concat([u32(0x04034b50),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),name,data]);const central=concat([u32(0x02014b50),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),name]);locals.push(local);centrals.push(central);offset+=local.length}const center=concat(centrals);const eocd=concat([u32(0x06054b50),u16(0),u16(0),u16(files.length),u16(files.length),u32(center.length),u32(offset),u16(0)]);return new Blob([concat([...locals,center,eocd])],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"})};
const xmlEscape=(value:string)=>value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const paragraphXml=(line:string)=>{if(!line)return "<w:p/>";const space=line!==line.trim()?" xml:space=\"preserve\"":"";return "<w:p><w:r><w:t"+space+">"+xmlEscape(line)+"</w:t></w:r></w:p>"};
const buildDocumentXml=(pages:string[])=>{const body:string[]=[];pages.forEach((text,index)=>{if(index)body.push("<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>");const lines=text.split(/\n/);const usable=lines.some((line)=>line.trim())?lines:["[No selectable text on this page]"];for(const line of usable)body.push(paragraphXml(line))});body.push("<w:sectPr><w:pgSz w:w=\"12240\" w:h=\"15840\"/><w:pgMar w:top=\"1440\" w:right=\"1440\" w:bottom=\"1440\" w:left=\"1440\"/></w:sectPr>");return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w:document xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\"><w:body>"+body.join("")+"</w:body></w:document>"};
const CONTENT_TYPES="<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\"><Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/><Default Extension=\"xml\" ContentType=\"application/xml\"/><Override PartName=\"/word/document.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml\"/><Override PartName=\"/word/styles.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml\"/></Types>";
const RELS="<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"word/document.xml\"/></Relationships>";
const DOC_RELS="<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\"/></Relationships>";
const STYLES="<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><w:styles xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\"><w:style w:type=\"paragraph\" w:default=\"1\" w:styleId=\"Normal\"><w:name w:val=\"Normal\"/><w:qFormat/></w:style></w:styles>";
const utf8=(value:string)=>new TextEncoder().encode(value);
const itemsToText=(items:any[])=>{const lines:string[]=[];let lastY:number|null=null;let line="";const flush=()=>{if(line.length){lines.push(line.replace(/[ \t]+$/,""));line=""}};for(const item of items){if(typeof item?.str!=="string")continue;const y=Array.isArray(item.transform)?Number(item.transform[5]):null;if(lastY!==null&&y!==null&&Math.abs(y-lastY)>3)flush();else if(line&&item.str&&!line.endsWith(" ")&&!item.str.startsWith(" "))line+=" ";line+=item.str;if(item.hasEOL){flush();lastY=null}else lastY=y}flush();return lines.join("\n").replace(/\n{3,}/g,"\n\n")};
const openError=(error:any)=>{if(error?.name==="PasswordException"||error?.code===1||error?.code===2)return "This PDF is password-protected. Remove the password and try again. Nothing was uploaded.";return "Could not open that PDF. Damaged files cannot be converted here."};
const loadPdfjs=async()=>{if(pdfjsLib)return pdfjsLib;const mod:any=await import(/* @vite-ignore */ PDFJS_SRC);pdfjsLib=mod.default??mod;pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;return pdfjsLib};
const stem=(name:string)=>name.replace(/\.pdf$/i,"")||"converted";
const chosenFile=()=>{const file=fileInput.files?.[0];if(!file)throw new Error("Choose a PDF first.");if(file.size>MAX_BYTES)throw new Error("That PDF is larger than 40 MB. Try a smaller file.");if(!file.type.includes("pdf")&&!file.name.toLowerCase().endsWith(".pdf"))throw new Error("Choose a PDF file.");return file};
fileInput.addEventListener("change",()=>{try{const file=chosenFile();fileMeta.textContent=file.name+" ("+Math.round(file.size/1024)+" KB)";docxBlob=null;downloadBtn.disabled=true;setStatus("PDF selected. Convert to extract selectable text.")}catch(error){fileMeta.textContent="Choose a PDF or drop it here. Nothing is uploaded.";setStatus(error instanceof Error?error.message:"Could not read that file.","error")}});
["dragenter","dragover"].forEach((eventName)=>dropZone.addEventListener(eventName,(event)=>{event.preventDefault();dropZone.classList.add("drag")}));
["dragleave","drop"].forEach((eventName)=>dropZone.addEventListener(eventName,(event)=>{event.preventDefault();dropZone.classList.remove("drag")}));
dropZone.addEventListener("drop",(event)=>{const file=event.dataTransfer?.files?.[0];if(!file)return;const list=new DataTransfer();list.items.add(file);fileInput.files=list.files;fileInput.dispatchEvent(new Event("change"))});
convertBtn.addEventListener("click",async()=>{
  convertBtn.disabled=true;downloadBtn.disabled=true;docxBlob=null;
  try{
    const file=chosenFile();
    setStatus("Loading PDF engine...");
    const pdfjs=await loadPdfjs();
    const data=await file.arrayBuffer();
    let doc:any;
    try{doc=await pdfjs.getDocument({data}).promise}catch(error){throw new Error(openError(error))}
    if(!doc.numPages)throw new Error("This PDF has no pages.");
    if(doc.numPages>MAX_PAGES)throw new Error("This PDF has "+doc.numPages+" pages. Convert a file with "+MAX_PAGES+" pages or fewer.");
    const total=doc.numPages;
    const warn=total>WARN_PAGES?(" "+total+" pages may take a while and can slow this tab."):"";
    const pages:string[]=[];
    for(let n=1;n<=total;n++){
      setStatus("Extracting text from page "+n+" of "+total+"..."+warn);
      const page=await doc.getPage(n);
      const content=await page.getTextContent();
      pages.push(itemsToText(content.items||[]));
      if("cleanup" in page)page.cleanup();
      await wait();
    }
    const xml=buildDocumentXml(pages);
    docxBlob=zipStore([{name:"[Content_Types].xml",data:utf8(CONTENT_TYPES)},{name:"_rels/.rels",data:utf8(RELS)},{name:"word/_rels/document.xml.rels",data:utf8(DOC_RELS)},{name:"word/document.xml",data:utf8(xml)},{name:"word/styles.xml",data:utf8(STYLES)}]);
    docxName=stem(file.name)+".docx";
    downloadBtn.disabled=false;
    const empty=pages.every((page)=>!page.trim());
    setStatus(empty?("Converted "+total+" page"+(total===1?"":"s")+", but no selectable text was found. Scanned or image-only PDFs will not produce useful Word text."):("Extracted text from "+total+" page"+(total===1?"":"s")+". Download the .docx. This is text extraction, not a layout replica."),"success");
  }catch(error){downloadBtn.disabled=true;setStatus(error instanceof Error?error.message:"Could not convert this PDF.","error")}
  finally{convertBtn.disabled=false}
});
