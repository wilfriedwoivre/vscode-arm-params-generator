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