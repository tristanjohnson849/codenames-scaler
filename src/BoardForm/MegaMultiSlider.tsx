import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { CardType } from "../BoardLayout";
import { typeToColor } from "../BoardView";
import { transformAndDispatch } from "../reactUtils";

interface RegionData {
    name: string;
    label: string;
    cardType: CardType;
    defaultValue: number;
}

interface MegaMultiSliderProps {
    regions: RegionData[];
    maxValue: number;
    onIntegerChange?: (name: string, value: number) => void;
}


interface NeighborData {
    index: number;
    prevName: string | undefined;
    nextName: string | undefined;
    cumValue: number;
}

const MegaMultiSlider: React.FC<MegaMultiSliderProps> = ({ regions, maxValue, onIntegerChange = () => {} }) => {
    const boundingDivRef = useRef<HTMLDivElement | null>(null);

    const regionsWithValues = regions.slice(0, -1);
    const [values, setValues] = useState(Object.fromEntries(regionsWithValues.map(({ name, defaultValue }) => [name, defaultValue])));


    const cumValues = regionsWithValues.reduce(
        (agg, {name}, i) => [...agg, (agg[i - 1] || 0) + values[name]], 
        [] as number[]
    );
    const remainderValue = maxValue - (cumValues[cumValues.length - 1] || 0);
    
    const neighbors: { [name: string]: NeighborData } = Object.fromEntries(regions.map(({ name }, i) => [name, {
        index: i,
        prevName: regions[i - 1]?.name,
        nextName: regions[i + 1]?.name,
        cumValue: cumValues[i]
    }]));

    const setNameValue = (name: string) => transformAndDispatch<number, { [name: string]: number }>(
        sanitizeAndAdjustNeighbors(neighbors, name, values, remainderValue, onIntegerChange), 
        (values) => values[name],
        setValues,
    );

    return (
        <div style={{
            width: '100%',
            padding: '16px 0',
            boxSizing: 'border-box'
        }}>
            <div ref={boundingDivRef} style={{
                position: 'relative',
                width: '100%'
            }}>
                <div style={{
                    borderRadius: '4px',
                    width: '100%',
                    height: '8px',
                    padding: 0,
                }}>
                {regions.map(({ name, label, cardType }, i) => (
                    <SliderRegion 
                        key={`${name}-region`}
                        name={name}
                        value={name in values ? values[name] : remainderValue}
                        color={typeToColor[cardType]}
                        maxValue={maxValue}
                        label={label}
                        isFirst={i === 0}
                        isLast={i === regions.length - 1}
                    />
                ))}
                </div>
                {regionsWithValues.map(({ name }, i) => {
                    return <SliderButton 
                        key={`${name}-sliderButton`}
                        cumValue={cumValues[i]}
                        maxValue={maxValue}
                        sliderWidth={boundingDivRef.current?.clientWidth || 0}
                        setValue={setNameValue(name)}
                    />
                })}
            </div>
        </div>
    );
};

const sanitizeAndAdjustNeighbors = (
    neighbors: { [name: string]: NeighborData }, 
    name: string,
    values: { [k: string]: number; },
    remainderValue: number,
    onIntegerChange: (name: string, value: number) => void
) => (
    (value: number): { [name: string]: number } => {
        const newValue = Math.max(0, value);

        const { nextName, index } = neighbors[name];
        const diff = values[name] - newValue;
        const prevNextValue = (nextName && values[nextName] !== undefined) ? values[nextName] : remainderValue
        const nextNewValue = diff + prevNextValue;
        
        const sanitizedNewValue = nextNewValue < 0 ? newValue + nextNewValue : newValue;
        const sanitizedNextNewValue = Math.max(0, nextNewValue);

        const isLast = index === values.length;
        const prevInt = toIntValue(values[name], isLast);
        const newInt = toIntValue(sanitizedNewValue, isLast);
        if (prevInt !== newInt) {
            onIntegerChange(name, Math.floor(sanitizedNewValue));
        }
        
        const prevNextInt = toIntValue(prevNextValue, isLast);
        const newNextInt = toIntValue(sanitizedNextNewValue, isLast);
        if (nextName !== undefined && prevNextInt !== newNextInt) {
            onIntegerChange(nextName, newNextInt);
        }

        if (nextName) {
            return {
                ...values,
                [name]: sanitizedNewValue,
                [nextName]: sanitizedNextNewValue

            }
        }
        return {
            ...values,
            [name]: sanitizedNewValue
        };
    }
);


const toIntValue = (value: number, isLast: boolean) => isLast ? Math.ceil(value) : Math.floor(value);

interface SliderButtonProps {
    maxValue: number;
    setValue: Dispatch<SetStateAction<number>>;
    sliderWidth: number;
    cumValue: number;
}

const SliderButton: React.FC<SliderButtonProps> = ({ cumValue, maxValue, setValue, sliderWidth }) => {
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [grabbed, setGrabbed] = useState<boolean>(false);

    return <div
        ref={sliderRef}
        style={{
            background: '#FFF',
            width: '24px',
            height: '16px',
            position: 'absolute',
            top: '-4px',
            left: `calc(${100 * cumValue/maxValue}% - 12px)`,
            borderRadius: '2px',
            cursor: grabbed ? 'grabbing': 'grab',

        }}
        onPointerDown={(e) => {
            sliderRef.current?.setPointerCapture(e.pointerId);
            setGrabbed(true);
        }}
        onPointerUp={(e) => {
            sliderRef.current?.releasePointerCapture(e.pointerId);
            setGrabbed(false);
        }}
        onPointerMove={grabbed ? (event) =>  setValue((prevValue) => {
            const shift = sliderWidth === 0 ? 0 : maxValue * event.movementX/sliderWidth;
            return prevValue + shift;
        }) : undefined}
    />
}

interface SliderRegionProps {
    name: string;
    value: number;
    color: string;
    maxValue: number;
    label: string;
    isFirst: boolean;
    isLast: boolean;
}

const SliderRegion: React.FC<SliderRegionProps> = ({ name, value, label, color, maxValue, isFirst, isLast }) => {
    const leftR = isFirst ? '4px' : '0';
    const rightR = isLast ? '4px' : '0';
    return (
        <div style={{ 
            position: 'relative',
            display: 'inline-block',
            width: `${100 * (value)/maxValue}%`,
            height: '100%',
            verticalAlign: 'top',
            margin: 0,
            whiteSpace: 'nowrap'
        }}>
            <input type="hidden" name={name} value={toIntValue(value, isLast)}/>
            <div style={{
                background: color, 
                width: '100%',
                height: '100%',
                borderRadius: `${leftR} ${rightR} ${rightR} ${leftR}`
            }}/>
            <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '12px',
                verticalAlign: 'top',
            }}>{label}: {toIntValue(value, isLast)}</div>
        </div>
    );
}


export default MegaMultiSlider;
