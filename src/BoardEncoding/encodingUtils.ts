import { CodenamesFormData, StartColors } from "../BoardForm";
import { zip } from 'lodash';

export const decodeWithKeys = (orderedValues: any[], orderedKeys: string[]): CodenamesFormData | undefined => {
    if (orderedValues && orderedValues.length <= orderedKeys.length) {
        return Object.fromEntries(zip(orderedKeys, orderedValues));
    }

    return undefined;
};

export const validate = (maybeFormData: any): CodenamesFormData | undefined => (
    isValidFormData(maybeFormData) 
        ? maybeFormData 
        : undefined
);

export const isValidFormData = (fd: any): boolean => {
    if (!(fd && fd.mode)) {
        return false;
    }
    if (fd.mode === 'Standard') {
        return (
            isPos(fd.boardRows) && 
            isPos(fd.boardColumns) && 
            isPos(fd.cards) && 
            isNonNeg(fd.startCards) && 
            isNonNeg(fd.assassins) && 
            StartColors.includes(fd.startColor) &&
            fd.seed
        );
    }
    if (fd.mode === 'Duet') {
        return (
            isPos(fd.boardRows) && 
            isPos(fd.boardColumns) && 
            isPos(fd.cards) && 
            isNonNeg(fd.assassins) && 
            fd.seed && 
            isNonNeg(fd.correctAssassins) &&
            isNonNeg(fd.correctBystanders) &&
            isNonNeg(fd.bystanderAssassins)
        );
    }

    return false;
};

const isNonNeg = (num: any): boolean => !isNaN(num) && num >= 0;
const isPos = (num: any): boolean => !isNaN(num) && num > 0;
