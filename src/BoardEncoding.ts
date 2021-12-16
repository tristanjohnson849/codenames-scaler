
import chunk from 'lodash/chunk';
import fill from 'lodash/fill';
import seedrandom from 'seedrandom';
import { CodenamesFormData } from './BoardForm';
import { CardType } from './BoardView';

export type FormDataVersion = 0 | 1;
const UNKNOWN_VERSION = 0;
const WRITE_VERSION = 1;

const v1FormDataKeys: string[] = Object.keys({
    boardRows: 0,
    boardColumns: 0,
    cards: 0,
    startCards: 0,
    startColor: 'Random',
    assassins: 0,
    seed: ''
}).sort();

export const encodeFormData = (formData: CodenamesFormData): string => {
    const orderedValues = v1FormDataKeys
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
        default:
            return undefined;
    }
};

const v1DecodeFormData = (orderedValues: any[]): CodenamesFormData | undefined => 
    decodeWithKeys(orderedValues, v1FormDataKeys);

const decodeWithKeys = (orderedValues: any[], orderedKeys: string[]): CodenamesFormData | undefined => {
    if (orderedValues && orderedValues.length == orderedKeys.length) {
        const ret: any = {};
        orderedKeys.forEach((key, i) => ret[key] = orderedValues[i]);
        if (isValidFormData(ret)) {
            return ret;
        }
    }

    return undefined;
}

const isValidFormData = (layout: any): boolean => (
    layout && 
    layout.boardRows && 
    layout.boardColumns && 
    layout.cards && 
    !isNaN(layout.startCards) && 
    !isNaN(layout.assassins) && 
    layout.seed
);

export const getStartColor = (
    startColor: 'Random' | 'Blue' | 'Red', 
    seed: string
): 'Blue' | 'Red' => {
    if (startColor == 'Random') {
        return seededRandomInt(seed + 'start')(0, 1) ? 'Blue' : 'Red';
    } else {
        return startColor;
    }
}

export const createLayout = ({
    boardRows,
    boardColumns,
    cards,
    startCards,
    startColor,
    assassins,
    seed
}: CodenamesFormData): CardType[][] => {
    const rand = seededRandomInt(seed);

    const actualStartColor = getStartColor(startColor, seed);
    const blueCards = cards + (actualStartColor == 'Blue' ? startCards : 0);
    const redCards = cards + (actualStartColor == 'Red' ? startCards : 0);

    const flatLayout: CardType[] = fill(Array(boardRows * boardColumns), 'Bystander');
    fill(flatLayout, 'Blue', 0, blueCards)
    fill(flatLayout, 'Red', blueCards, blueCards + redCards);
    fill(flatLayout, 'Assassin', blueCards + redCards, blueCards + redCards + assassins);

    shuffle(flatLayout, rand);

    return chunk(flatLayout, boardColumns);
};

function shuffle<T>(arr: T[], rand: (min: number, max: number) => number): void {
    for (var i = arr.length - 1; i > 0; i--) {
        const j = rand(0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

export const seededRandomInt = (seed: string): (min: number, max: number) => number => {
    const rand = seedrandom(seed);
    return (min: number, max: number): number => Math.floor(rand() * (max - min + 1) + min);
};
