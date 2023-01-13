import React, { FormEventHandler, useState } from "react";
import Collapsible from "react-collapsible";
import { PAGE_SECTION_STYLE } from "../BoardGenerator";
import { getDefaultOverlaps } from "../BoardLayout";
import { typeToColor } from "../BoardView";
import { BasicInput } from "./BasicInput";
import CollapseButton, { COLLAPSIBLE_EASING, COLLAPSIBLE_TIME } from "./CollapseButton";
import { InputCard } from "./InputCard";
import { RadioInput } from "./RadioInput";
import { SeedInput } from "./SeedInput";

export type GameMode = 'Standard' | 'Duet';

export interface CodenamesFormData {
    boardRows: number;
    boardColumns: number;
    cards: number;
    assassins: number;
    seed: string;
    mode: GameMode;
    [key: string]: string | number;
}

export const StartColors = ['Blue', 'Red', 'Random'] as const;

export interface StandardFormData extends CodenamesFormData {
    mode: 'Standard';
    startCards: number;
    startColor: typeof StartColors[number];
}

export interface DuetFormData extends CodenamesFormData {
    mode: 'Duet';
    correctAssassins: number;
    correctBystanders: number;
    bystanderAssassins: number;
}

export interface ModeConfig {
    mode: GameMode;

}

export interface BoardFormProps {
    formData?: CodenamesFormData;
    setFormData: (formData: CodenamesFormData) => void
}

export const linkButtonStyle = {
    padding: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Helvetica,Arial,sans-serif',
    fontSize: '16px',
    textDecoration: 'underline',
    color: '#FFF'
};

const defaultFormValues: { [mode in GameMode]: CodenamesFormData } = {
    Standard: {
        boardRows: 5,
        boardColumns: 5,
        cards: 8,
        startCards: 1,
        assassins: 1,
        startColor: 'Random',
        mode: 'Standard',
        seed: ''
    },
    Duet: {
        boardRows: 5,
        boardColumns: 5,
        cards: 9,
        startCards: 0,
        assassins: 3,
        startColor: 'Random',
        mode: 'Duet',
        seed: ''
    }
};


const BoardForm: React.FC<BoardFormProps> = ({ formData, setFormData }) => {
    const startValues = formData
        ? formData
        : {
            ...defaultFormValues.Standard,
            seed: randomSeed()
        };

    // for animations
    const [proxyGameMode, setProxyGameMode] = useState(startValues.mode);
    const [mode, _setGameMode] = useState(startValues.mode);

    const [rows, setRows] = useState(startValues.boardRows);
    const [columns, setColumns] = useState(startValues.boardColumns);
    const [cards, setCards] = useState(startValues.cards);
    const [startCards, setStartCards] = useState(startValues.startCards);
    const [assassins, setAssassins] = useState(startValues.assassins);
    const [startColor, setStartColor] = useState(startValues.startColor);
    const [seed, setSeed] = useState(startValues.seed);

    const [newSeedOnGenerate, setNewSeedOnGenerate] = useState<boolean>(true);
    const [closeConfigOnGenerate, setCloseConfigOnGenerate] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [errorKey, setErrorKey] = useState<number>(0);

    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState<boolean>(true);
    const [resetFormInputs, setResetFormInputs] = useState<boolean>(false);

    const setGameMode = (newMode: GameMode) => {
        if (mode !== newMode) {
            const defaults = defaultFormValues[newMode];
            setRows(defaults.boardRows);
            setColumns(defaults.boardColumns);
            setCards(defaults.cards);
            setStartCards(defaults.startCards);
            setAssassins(defaults.assassins);
            setStartColor(defaults.startColor);
            setResetFormInputs(false);
        }
        _setGameMode(newMode);
    };

    const {
        correctAssassins,
        correctBystanders,
        bystanderAssassins
    } = getDefaultOverlaps(rows, columns, cards, assassins);

    const onFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setErrorKey(prev => prev + 1);
        const formData: any = {};
        for (let [k, v] of (new FormData(e.currentTarget)).entries()) {
            formData[k] = /^\d+$/.test(v as string) ? parseInt(v as string) : v;
        }

        if (newSeedOnGenerate) {
            const newSeed = randomSeed();
            formData.seed = newSeed;
            setSeed(newSeed);
        }

        const totalCards = formData.boardRows * formData.boardColumns;
        const configuredCards = mode === 'Standard'
            ? formData.cards * 2 + formData.startCards + formData.assassins
            : formData.cards + formData.assassins;

        if (configuredCards > totalCards) {
            setError(`Too many configured cards (${configuredCards}) for this board (${formData.boardRows}x${formData.boardColumns}=${totalCards})`);
            return false;
        } else {
            if (closeConfigOnGenerate) {
                setIsCollapsibleOpen(false);
            }
            setFormData(formData);
            setError(null);
        }
    };

    return (
        <Collapsible
            tabIndex={0}
            open={isCollapsibleOpen}
            onTriggerOpening={() => setIsCollapsibleOpen(true)}
            onTriggerClosing={() => setIsCollapsibleOpen(false)}
            trigger={<CollapseButton isOpen={isCollapsibleOpen} label="Game Config" />}
            containerElementProps={{ style: PAGE_SECTION_STYLE }}
            transitionTime={COLLAPSIBLE_TIME}
            easing={COLLAPSIBLE_EASING}
        >
            <form onSubmit={onFormSubmit}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                    {/* TODO confirm board reset */}
                    <InputCard title="Game Mode">
                        <RadioInput 
                            labels={['Standard', 'Duet']} name="mode" 
                            value={mode} 
                            onChange={(e) => {
                                if (!window.confirm('This will reset config to default values - are you sure?')) {
                                    return;
                                }
                                setProxyGameMode(e.target.value as any);
                                setResetFormInputs(true);
                            }}
                        />
                    </InputCard>
                </div>
                <hr style={{ height: '1px', border: 'none', background: '#555', margin: '24px 0' }} />
                <Collapsible
                    trigger=""
                    open={!resetFormInputs} onClose={() => setGameMode(proxyGameMode)}
                    transitionTime={COLLAPSIBLE_TIME}
                    easing={COLLAPSIBLE_EASING}
                >
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        marginBottom: '24px'
                    }}>

                        <InputCard title="Board">
                            <BasicInput 
                                label="Rows" type="number" name="boardRows" 
                                value={rows} 
                                onChange={(e) => setRows(parseInt(e.target.value))} 
                                defaultValue={defaultFormValues[mode].boardRows} 
                            />
                            <BasicInput 
                                label="Columns" type="number" name="boardColumns" 
                                value={columns} 
                                onChange={(e) => setColumns(parseInt(e.target.value))} 
                                defaultValue={defaultFormValues[mode].boardColumns} 
                            />
                        </InputCard>
                        <InputCard title="Game">
                            <BasicInput 
                                label="Team Cards" type="number" name="cards" 
                                value={cards} 
                                onChange={(e) => setCards(parseInt(e.target.value))} 
                                defaultValue={suggestedCards(rows, columns, mode)} 
                            />
                            <BasicInput 
                                label="Assassins" type="number" name="assassins" 
                                value={assassins} 
                                onChange={(e) => setAssassins(parseInt(e.target.value))} 
                                defaultValue={suggestedAssassins(rows, columns, mode)} 
                            />
                            {mode === 'Duet' && (
                                <>
                                    <BasicInput 
                                        label="Correct/Assassin" type="number" name="correctAssassins" 
                                        readOnly
                                        value={correctAssassins} 
                                    />
                                    <BasicInput 
                                        label="Correct/Bystander" type="number" name="correctBystanders" 
                                        readOnly
                                        value={correctBystanders}
                                    />
                                    <BasicInput 
                                        label="Bystander/Assassin" type="number" name="bystanderAssassins" 
                                        readOnly
                                        value={bystanderAssassins}
                                    />
                                </>
                            )}
                        </InputCard>
                        {mode === 'Standard' && <InputCard title="Standard Mode">
                            <BasicInput 
                                label="Start Handicap" type="number" name="startCards" 
                                value={startCards} 
                                onChange={(e) => setStartCards(parseInt(e.target.value))} 
                                defaultValue={defaultFormValues[mode].startCards} 
                            />
                            <RadioInput 
                                title="Starting Team" labels={['Red', 'Blue', 'Random']} name="startColor" 
                                value={startColor} 
                                onChange={(e) => setStartColor(e.target.value as any)} 
                                defaultValue="Random" 
                            />
                        </InputCard>}
                        <InputCard title="Random">
                            <SeedInput name="seed" value={seed} onChange={(e) => setSeed(e.target.value)} />
                        </InputCard>

                    </div>
                    <button style={{
                        background: typeToColor[mode === 'Standard' ? 'Blue' : 'DuetCorrect'],
                        marginRight: '12px'
                    }}>
                        Generate
                    </button>
                    <label style={{ marginRight: '12px', color: '#888', fontSize: '14px' }}>
                        <input type="checkbox" checked={newSeedOnGenerate} onChange={(e) => setNewSeedOnGenerate(e.target.checked)} />
                        with a new random seed
                    </label>
                    <label style={{ marginRight: '12px', color: '#888', fontSize: '14px' }}>
                        <input type="checkbox" checked={closeConfigOnGenerate} onChange={(e) => setCloseConfigOnGenerate(e.target.checked)} />
                        Close config?
                    </label>

                    <button
                        type="button"
                        onClick={() => {
                            const defaults = defaultFormValues[mode];
                            setRows(defaults.boardRows);
                            setColumns(defaults.boardColumns);
                            setCards(defaults.cards);
                            setStartCards(defaults.startCards);
                            setAssassins(defaults.assassins);
                            setStartColor(defaults.startColor);
                            setSeed(randomSeed());
                        }}
                        style={{
                            background: typeToColor[mode === 'Standard' ? 'Red' : 'Bystander'],
                            marginRight: '12px'
                        }}>
                        Reset Defaults
                    </button>
                </Collapsible>
                <div
                    key={errorKey}
                    style={{
                        color: '#c9461d',
                        animationName: 'fadeOut',
                        animationDuration: '6s',
                        animationFillMode: 'forwards',
                        marginTop: '16px'
                    }}>
                    {error}
                </div>
            </form>
        </Collapsible>
    );
};

const suggestedCards = (rows: number, columns: number, gameMode: GameMode) => {
    if (!rows || !columns) {
        return defaultFormValues[gameMode].cards;
    }
    if (gameMode === 'Standard') {
        return Math.floor(rows * columns / 3);
    } else {
        return Math.floor(rows * columns / 3) + 1;
    }
};

const suggestedAssassins = (rows: number, columns: number, gameMode: GameMode) =>
    Math.floor(rows * columns / (gameMode === 'Standard' ? 15 : 8)) || defaultFormValues[gameMode].assassins;

export const randomSeed = (): string => Math.random().toString(36).slice(2);

export function useControllableState<T>(value: T, initialValue?: T | undefined): [state: T, setState: (action: React.SetStateAction<T>) => void] {
    const [stateValue, setState] = useState(initialValue || value);
    const effectiveValue = value !== undefined ? value : stateValue;
    return [effectiveValue, setState];
}

export default BoardForm;
