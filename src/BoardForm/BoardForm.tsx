import React, { FormEventHandler, useState } from "react";
import Collapsible from "react-collapsible";
import { PAGE_SECTION_STYLE } from "../BoardGenerator";
import { typeToColor } from "../BoardView";
import CollapseButton, { COLLAPSIBLE_EASING, COLLAPSIBLE_TIME } from "./CollapseButton";
import DuetForm, { defaultFormValues as duetDefaultValues,  validateFormData as validateDuetFormData } from "./DuetForm";
import { InputCard } from "./InputCard";
import { RadioInput } from "./RadioInput";
import { SeedInput } from "./SeedInput";
import StandardForm, { defaultFormValues as standardDefaultValues, validateFormData as validateStandardFormData } from "./StandardForm";

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
    Standard: standardDefaultValues,
    Duet: duetDefaultValues
};

export const angleStripeBackground = (
    color1: string, 
    color2: string, 
    reverse: boolean = false, 
    sizeInPx: number = 24
) => `repeating-linear-gradient(${reverse ? "": "-"}45deg, ${color1}, ${color1} ${sizeInPx}px, ${color2} ${sizeInPx}px, ${color2} ${sizeInPx * 2}px)`;

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

    const [seed, setSeed] = useState(startValues.seed);

    const [newSeedOnGenerate, setNewSeedOnGenerate] = useState<boolean>(true);
    const [closeConfigOnGenerate, setCloseConfigOnGenerate] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [errorKey, setErrorKey] = useState<number>(0);

    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState<boolean>(true);
    const [resetFormInputs, setResetFormInputs] = useState<boolean>(false);

    const setGameMode = (newMode: GameMode) => {
        if (mode !== newMode) {
            setResetFormInputs(false);
        }
        _setGameMode(newMode);
    };

    const onFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setErrorKey(prev => prev + 1);
        const formData: any = {};
        for (let [k, v] of (new FormData(e.currentTarget)).entries()) {
            const maybeInt = parseInt(v as string);
            formData[k] = isNaN(maybeInt) ? v : maybeInt;
        }

        if (newSeedOnGenerate) {
            const newSeed = randomSeed();
            formData.seed = newSeed;
            setSeed(newSeed);
        }

        const validated = mode === 'Standard' 
            ? validateStandardFormData(formData as StandardFormData, setError) 
            : validateDuetFormData(formData as DuetFormData, setError);

        if (!validated) {
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
                        <InputCard title="Random">
                            <SeedInput name="seed" value={seed} onChange={(e) => setSeed(e.target.value)} />
                        </InputCard>
                        {mode === 'Standard' ? <StandardForm startValues={startValues as StandardFormData}/> : <DuetForm startValues={startValues as DuetFormData}/>}

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

                    {/* TODO fix reset default button */}
                    {/* <button
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
                    </button> */}
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

export const randomSeed = (): string => Math.random().toString(36).slice(2);

export function useControllableState<T>(value: T, initialValue?: T | undefined): [state: T, setState: (action: React.SetStateAction<T>) => void] {
    const [stateValue, setState] = useState(initialValue || value);
    const effectiveValue = value !== undefined ? value : stateValue;
    return [effectiveValue, setState];
}

export default BoardForm;
