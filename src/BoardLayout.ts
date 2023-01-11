import chunk from 'lodash/chunk';
import fill from 'lodash/fill';
import seedrandom from 'seedrandom';
import { CodenamesFormData, DuetFormData, GameMode, StandardFormData } from './BoardForm/BoardForm';


export type CardType = 'Blue' | 'Red' | 'Bystander' | 'Assassin' | 'DuetCorrect';
export interface BoardLayout<M extends GameMode, C> {
    mode: M;
    cards: C[][];
    startColor: CardType;
    info?: string[];
}

export type StandardLayout = BoardLayout<'Standard', CardType>
export type DuetLayout = BoardLayout<'Duet', CardType[]>

export type AnyBoardLayout =
    StandardLayout |
    DuetLayout;

export type DisplayableLayout = BoardLayout<any, CardType>

export const createLayout = (formData: CodenamesFormData): AnyBoardLayout => (
    formData.mode === 'Standard'
        ? createStandardLayout(formData as StandardFormData)
        : createDuetLayout(formData as DuetFormData)
);
const createStandardLayout = ({
    boardRows, boardColumns, cards, startCards, startColor, assassins, seed
}: StandardFormData): StandardLayout => {
    const rand = seededRandomInt(seed);

    const actualStartColor = getStartColor(startColor, seed);
    const blueCards = cards + (actualStartColor === 'Blue' ? startCards : 0);
    const redCards = cards + (actualStartColor === 'Red' ? startCards : 0);

    const flatLayout: CardType[] = fill(Array(boardRows * boardColumns), 'Bystander');
    let step = 0;
    step = _fill(flatLayout, 'Blue', step, step + blueCards);
    step = _fill(flatLayout, 'Red', step, step + redCards);
    _fill(flatLayout, 'Assassin', step, step + assassins);

    shuffle(flatLayout, rand);

    return { mode: 'Standard', cards: chunk(flatLayout, boardColumns), startColor: getStartColor(startColor, seed) };
};

const createDuetLayout = ({
    boardRows,
    boardColumns,
    seed,
    cards,
    correctAssassins,
    correctBystanders,
    bystanderAssassins
}: DuetFormData): DuetLayout => {
    const rand = seededRandomInt(seed);

    const bothCorrect = cards - (correctAssassins + correctBystanders);
    const bothAssassins = cards - (correctAssassins + bystanderAssassins);
    const bothBystander = cards - (correctBystanders + bystanderAssassins);


    const flatLayout: CardType[][] = fill(Array(boardRows * boardColumns), ['Bystander', 'Bystander']);
    let step = 0;
    step = _fill(flatLayout, ['DuetCorrect', 'DuetCorrect'], step, step + bothCorrect);
    step = _fill(flatLayout, ['DuetCorrect', 'Assassin'], step, step + correctAssassins);
    step = _fill(flatLayout, ['Assassin', 'DuetCorrect'], step, step + correctAssassins);
    step = _fill(flatLayout, ['DuetCorrect', 'Bystander'], step, step + correctBystanders);
    step = _fill(flatLayout, ['Bystander', 'DuetCorrect'], step, step + correctBystanders);
    step = _fill(flatLayout, ['Assassin', 'Assassin'], step, step + bothAssassins);
    step = _fill(flatLayout, ['Bystander', 'Assassin'], step, step + bystanderAssassins);
    _fill(flatLayout, ['Assassin', 'Bystander'], step, step + bystanderAssassins);

    shuffle(flatLayout, rand);
    return {
        mode: 'Duet',
        cards: chunk(flatLayout, boardColumns),
        startColor: 'DuetCorrect',
        info: [
            `Correct / Correct: ${bothCorrect} total`,
            `Correct / Assassin: ${correctAssassins} per team`,
            `Correct / Bystander: ${correctBystanders} per team`,
            `Assassin / Assassin: ${bothAssassins} total`,
            `Assassin / Bystander: ${bystanderAssassins} per team`,
            `Bystander / Bystander: ${bothBystander} total`,
        ]
    };
};

export interface DuetOverlaps {
    correctAssassins: number;
    correctBystanders: number;
    bystanderAssassins: number;
}

export const getDefaultOverlaps = (
    boardRows: number,
    boardColumns: number,
    cards: number,
    assassins: number
): DuetOverlaps => {
    const bystanders = boardRows * boardColumns - (cards + assassins);

    return {
        correctAssassins: Math.min(Math.floor(cards / 5), Math.floor(assassins / 3)),
        correctBystanders: Math.min(Math.floor(cards / 1.5), Math.floor(bystanders / 2)),
        bystanderAssassins: Math.min(Math.floor(bystanders / 7), Math.floor(assassins / 3)),
    }
};

export const getStartColor = (
    startColor: 'Random' | 'Blue' | 'Red',
    seed: string
): 'Blue' | 'Red' => {
    if (startColor === 'Random') {
        return seededRandomInt(seed + 'start')(0, 1) ? 'Blue' : 'Red';
    } else {
        return startColor;
    }
};

// fill and return end pos
function _fill<T>(arr: T[], value: T, start: number, end: number): number {
    fill(arr, value, start, end);
    return end;
}
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
