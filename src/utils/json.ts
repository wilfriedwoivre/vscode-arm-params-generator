import * as stripJson from "strip-json-comments";

export function cleanJsonContent(text: string):string {
    text = text.replace(/\\n/g, "\\n")  
           .replace(/\\'/g, "\\'")
           .replace(/\\"/g, '\\"')
           .replace(/\\&/g, "\\&")
           .replace(/\\r/g, "\\r")
           .replace(/\\t/g, "\\t")
           .replace(/\\b/g, "\\b")
           .replace(/\\f/g, "\\f");
        // remove non-printable and other non-valid JSON chars
    text = text.replace(/[\u0000-\u0019]+/g,""); 
    text = text.trim();

    return text;
}

export function isValidARMFile(text: string): boolean{
    try {
        
        var content = JSON.parse(stripJson(cleanJsonContent(text)));
        return content.$schema === "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#"; 
    }
    catch (error) {
        console.error(error);
        return false; 
    }
}