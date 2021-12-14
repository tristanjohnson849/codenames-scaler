import React, { useState } from "react";

export interface CodenamesFormData {
    boardRows: number;
    boardColumns: number;
    cards: number;
    startCards: number;
    assassins: number;
    startColor: 'Blue' | 'Red' | 'Random';
    seed: string;
}

export interface BoardFormProps {
    initialFormData?: CodenamesFormData;
    onSubmit: (formData: CodenamesFormData) => void
}

const linkButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Helvetica,Arial,sans-serif',
    fontSize: '16px',
    textDecoration: 'underline',
    color: '#FFF'
};

const defaultFormValues: Readonly<Omit<CodenamesFormData, 'seed'>> = {
    boardRows: 5,
    boardColumns: 5,
    cards: 8,
    startCards: 1,
    assassins: 1,
    startColor: 'Random'
};

const BoardForm: React.FC<BoardFormProps> = ({ initialFormData, onSubmit }) => {
    const startValues = initialFormData
        ? initialFormData
        : {
            ...defaultFormValues,
            seed: randomSeed()
        }

    const [rows, setRows] = useState(startValues.boardRows);
    const [columns, setColumns] = useState(startValues.boardColumns);
    const [cards, setCards] = useState(startValues.cards);
    const [startCards, setStartCards] = useState(startValues.startCards);
    const [assassins, setAssassins] = useState(startValues.assassins);
    const [startColor, setStartColor] = useState(startValues.startColor);
    const [seed, setSeed] = useState(startValues.seed);

    const [error, setError] = useState<string | null>(null);

    const setErrorTimeout: typeof setError = (action) => {
        setTimeout(() => setError(null), 6 * 1000);
        setError(action);
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            const formData: any = {};
            for (let [k, v] of (new FormData(e.currentTarget)).entries()) {
                
                const asInt = parseInt(v as string);
                formData[k] = /^\d+$/.test(v as string) ? parseInt(v as string) : v;
            }
            const totalCards = formData.boardRows * formData.boardColumns;
            const configuredCards = formData.cards * 2 + formData.startCards + formData.assassins;
            if (configuredCards >= totalCards) {
                setErrorTimeout(`Too many configured cards (${configuredCards}) for this board (${formData.boardRows}x${formData.boardColumns}=${totalCards})`);
                return false;
            } else {
                onSubmit(formData);
            }
        }} style={{
            margin: '32px',
            border: '1px solid #555',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '8px 8px 12px #2b2b2b',
        }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                marginBottom: '12px'
            }}>
                <InputCard title="Board" inputs={[
                    <BasicInput label="Rows" type="number" name="boardRows" value={rows} onChange={(e) => setRows(parseInt(e.target.value))} defaultValue={5} />,
                    <BasicInput label="Columns" type="number" name="boardColumns" value={columns} onChange={(e) => setColumns(parseInt(e.target.value))} defaultValue={5} />,
                ]} />

                <InputCard title="Game" inputs={[
                    <BasicInput label="Team Cards" type="number" name="cards" value={cards} onChange={(e) => setCards(parseInt(e.target.value))} defaultValue={Math.floor(rows * columns / 3) || 8} />,
                    <BasicInput label="Start Handicap" type="number" name="startCards" value={startCards} onChange={(e) => setStartCards(parseInt(e.target.value))} defaultValue={1} />,
                    <BasicInput label="Assassins" type="number" name="assassins" value={assassins} onChange={(e) => setAssassins(parseInt(e.target.value))} defaultValue={Math.floor(rows * columns / 15) || 1} />,
                    <RadioInput title="Starting Team" labels={['Red', 'Blue', 'Random']} name="startColor" value={startColor} onChange={(e) => setStartColor(e.target.value as any)} defaultValue="Random" />
                ]} />
                <InputCard title="Random" inputs={[<SeedInput name="seed" value={seed} onChange={(e) => setSeed(e.target.value)}/>]}/>
            </div>
            <button style={{ ...linkButtonStyle, marginRight: '8px' }}>Generate</button>

            <button
                type="button"
                onClick={() => {
                    setRows(defaultFormValues.boardRows);
                    setColumns(defaultFormValues.boardColumns);
                    setCards(defaultFormValues.cards);
                    setStartCards(defaultFormValues.startCards);
                    setAssassins(defaultFormValues.assassins);
                    setStartColor(defaultFormValues.startColor);
                    setSeed(randomSeed());
                }}
                style={{ ...linkButtonStyle, marginRight: '8px' }}>
                Reset Defaults
            </button>
            {error && <span className="fade-out" style={{ color: '#c9461d' }}>{error}</span>}
        </form>
    );
};

interface InputCardProps {
    title: string;
    inputs: React.ReactComponentElement<any, { value: any, defaultValue: any }>[]
}

const InputCard: React.FC<InputCardProps> = ({ title, inputs }) => {
    return (
        <div style={{ marginLeft: '24px' }}>
            <div style={{ paddingLeft: '16px', paddingBottom: '8px' }}><b>{title}</b></div>
            <div style={{
                border: '1px solid #555',
                padding: '16px',
                borderRadius: '16px',
                boxShadow: '6px 6px 8px #2b2b2b',
            }}>
                {inputs}
            </div>
        </div>
    );
};

const BasicInput: React.FC<{ label: string } & React.ComponentProps<"input">> = ({ label, value, defaultValue, ...inputProps }) => {
    const [inputValue, setInputValue] = useControllableState(value, defaultValue || '');

    return (
        <label style={{ display: 'flex', flexDirection: 'column', margin: '8px' }}>
            <span>{label} {defaultValue != undefined && (
                <button
                    type="button"
                    style={{ ...linkButtonStyle, color: '#aaa' }}
                    onClick={() => {
                        setInputValue(defaultValue);
                        // @ts-ignore
                        inputProps.onChange && inputProps.onChange({ target: { value: inputProps.defaultValue}})
                    }}
                >
                    (Suggested: {defaultValue})
                </button>
            )}</span>
            <input 
                {...inputProps} 
                value={inputValue} 
                onChange={(e) => { 
                    setInputValue(e.target.value); 
                    inputProps.onChange && inputProps.onChange(e);
                }}
            />
        </label>
    );
};

const RadioInput: React.FC<{ title: string, labels: string[] } & React.ComponentProps<"input">> = ({ title, labels, value, defaultValue, onChange, ...inputProps }) => {
    const [checkedLabel, setCheckedLabel] = useControllableState(value, defaultValue || labels[0]);

    return (
        <div>
            <div>
                {title} {defaultValue != undefined && (
                    <button
                        type="button"
                        style={{ ...linkButtonStyle, color: '#aaa' }}
                        onClick={() => {
                            // @ts-ignore
                            onChange && onChange({ target: { value: defaultValue }});
                            setCheckedLabel(defaultValue);
                        }}
                    >
                        (Suggested: {defaultValue})
                    </button>
                )}
            </div>
            <hr />
            {labels.map((label) => (
                <label style={{ marginRight: '6px' }}>{label}
                    <input
                        type="radio"
                        value={label}
                        checked={label == checkedLabel}
                        onChange={(e) => {
                            setCheckedLabel(label);
                            onChange && onChange(e);
                        }}
                        {...inputProps}
                    />
                </label>
            ))}
        </div>
    );
};

const randomSeed = (): string => Math.random().toString(36).slice(2);

const SeedInput: React.FC<React.ComponentProps<"input">> = ({ value, onChange, ...inputProps }) => {
    const [seed, setSeed] = useControllableState(value, randomSeed());

    return (
        <div>
            <div>
                Seed 
                <button
                    type="button"
                    style={{ ...linkButtonStyle, color: '#aaa' }}
                    onClick={() => {
                        const newSeed = randomSeed();
                        setSeed(newSeed);
                        // @ts-ignore
                        onChange && onChange({ target: { value: newSeed }});
                    }}
                >
                    (New Seed)
                </button>
            </div>
            <input 
                {...inputProps}
                type="text" 
                value={seed} 
                onChange={(e) => { 
                    setSeed(e.target.value);
                    onChange && onChange(e) 
                }}
            />
        </div>
    );
};

function useControllableState<T>(value: T, initialValue: T): [state: T, setState: (action: React.SetStateAction<T>) => void] {
    const [stateValue, setState] = useState(initialValue);
    const effectiveValue = value !== undefined ? value : stateValue;
    return [effectiveValue, setState];
}

export default BoardForm;
