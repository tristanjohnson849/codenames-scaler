import { CodenamesFormData, GameMode } from '../BoardForm';
import { decodeWithKeys, validate } from './encodingUtils';
import { v1DecodeFormData, v1FormDataKeys, v2DecodeFormData, v2FormDataKeys } from './oldEncoding';

export type FormDataVersion = 0 | 1 | 2 | 3;
// eslint-disable-next-line
const UNKNOWN_VERSION = 0;
const WRITE_VERSION = 2;

const v3StandardKeys = [
    'mode', 
    ...([
        'boardRows',
        'boardColumns',
        'cards',
        'startCards',
        'assassins',
        'startColor',
        'seed',
    ].sort())
];

const v3DuetKeys = [
    'mode', 
    ...([
        'boardRows',
        'boardColumns',
        'cards',
        'assassins',
        'seed',
        'correctAssassins',
        'correctBystanders',
        'bystanderAssassins'
    ].sort())
];

const formDataKeys: { [key: string]: string[][] } = {
    Standard: [
        [],
        v1FormDataKeys,
        v2FormDataKeys,
        v3StandardKeys
    ],
    Duet: [
        [],
        v1FormDataKeys,
        v2FormDataKeys,
        v3DuetKeys
    ],
};

export const encodeFormData = (formData: CodenamesFormData): string => {
    const orderedValues = formDataKeys[formData.mode][WRITE_VERSION]
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

    if (version === 1) {
        return v1DecodeFormData(orderedValues);
    } else if (version === 2) {
        return v2DecodeFormData(orderedValues);
    } else if (version >= 3) {
        const [mode, ...rest] = orderedValues;
        return modeAwareDecodeFormData(version, mode, rest);
    } else {
        return undefined;
    }
};

const modeAwareDecodeFormData = (version: FormDataVersion, mode: any, orderedValues: any[]): CodenamesFormData | undefined => {
    const versionedKeys = formDataKeys[mode as string];
    if (!versionedKeys || !versionedKeys.length) {
        return undefined;

    }

    const decoded = decodeWithKeys(orderedValues, versionedKeys[version]);
    if (decoded) {
        decoded.mode = mode as GameMode;
    }

    return validate(decoded);
}
