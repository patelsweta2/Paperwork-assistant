import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

export const createTemplate = (zip: PizZip) => {
    return new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });
};