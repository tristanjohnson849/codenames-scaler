import { CodenamesFormData } from './BoardForm/BoardForm';

export type FormDataVersion = 0 | 1 | 2;
// eslint-disable-next-line
const UNKNOWN_VERSION = 0;
const WRITE_VERSION = 2;

const v1FormDataKeys = [
    'boardRows',
    'boardColumns',
    'cards',
    'startCards',
    'startColor',
    'assassins',
    'seed'
].sort();

const v2FormDataKeys = [
    ...v1FormDataKeys,
    'mode',
].sort();

const formDataKeys = [
    [],
    v1FormDataKeys,
    v2FormDataKeys
];

export const encodeFormData = (formData: CodenamesFormData): string => {
    const orderedValues = formDataKeys[WRITE_VERSION]
                            .map((k): [k: string, v: string | number] => [k, formData[k]])
                            .sort(([k1], [k2]) => k1.localeCompare(k2))
                            .map(([_, v]) => v);
    return btoa(JSON.stringify([WRITE_VERSION, ...orderedValues]));
}

export const decodeFormData = (slug: string): CodenamesFormData | undefined => {
    let orderedValues: any[] = [];
    let version: FormDataVersion = 0;
    try {
        [version, ...orderedValues] = JSON.parse(atob(slug));
    } catch {
        return undefined;
    }

    switch(version) {
        case 1:
            return v1DecodeFormData(orderedValues);
        case 2:
            return v2DecodeFormData(orderedValues);
        default:
            return undefined;
    }
};

const v1DecodeFormData = (orderedValues: any[]): CodenamesFormData | undefined => {
    const maybeFormData = decodeWithKeys(orderedValues, v1FormDataKeys);
    if (maybeFormData) {
        maybeFormData.mode = 'Standard';
    }

    return validate(maybeFormData);
}

const v2DecodeFormData = (orderedValues: any[]): CodenamesFormData | undefined => 
    validate(decodeWithKeys(orderedValues, v2FormDataKeys));

const decodeWithKeys = (orderedValues: any[], orderedKeys: string[]): CodenamesFormData | undefined => {
    if (orderedValues && orderedValues.length <= orderedKeys.length) {
        const ret: any = {};
        orderedKeys.forEach((key, i) => ret[key] = orderedValues[i]);
        return ret;
    }

    return undefined;
};

const validate = (maybeFormData: any): CodenamesFormData | undefined => {
    if (isValidFormData(maybeFormData)) {
        return maybeFormData;
    }
    return undefined;
};

const isValidFormData = (maybeFormData: any): boolean => (
    maybeFormData && 
    maybeFormData.boardRows && 
    maybeFormData.boardColumns && 
    maybeFormData.cards && 
    !isNaN(maybeFormData.startCards) && 
    !isNaN(maybeFormData.assassins) && 
    maybeFormData.seed &&
    maybeFormData.mode
);
