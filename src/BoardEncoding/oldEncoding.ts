import { CodenamesFormData } from "../BoardForm";
import { getDefaultOverlaps } from "../BoardLayout";
import { decodeWithKeys, validate } from "./encodingUtils";

export const v1FormDataKeys = [
    'boardRows',
    'boardColumns',
    'cards',
    'startCards',
    'startColor',
    'assassins',
    'seed'
].sort();

export const v2FormDataKeys = [
    ...v1FormDataKeys,
    'mode',
].sort();

export const v1DecodeFormData = (orderedValues: any[]): CodenamesFormData | undefined => {
    const decoded = decodeWithKeys(orderedValues, v1FormDataKeys);
    if (decoded) {
        decoded.mode = 'Standard';
    }

    return validate(decoded);
}

export const v2DecodeFormData = (orderedValues: any[]): CodenamesFormData | undefined => {
    const decoded = decodeWithKeys(orderedValues, v2FormDataKeys);
    if (
        decoded && 
        decoded.mode === 'Duet' &&
        decoded.boardRows &&
        decoded.boardColumns &&
        decoded.cards && 
        decoded.assassins
    ) {
        const { 
            correctAssassins, 
            correctBystanders,
            bystanderAssassins
         } = getDefaultOverlaps(decoded.boardRows, decoded.boardColumns, decoded.cards, decoded.assassins);
        decoded.correctAssassins = correctAssassins;
        decoded.correctBystanders = correctBystanders;
        decoded.bystanderAssassins = bystanderAssassins;
    }

    return decoded;
}
