import React from "react";
import { useControllableState, linkButtonStyle } from "./BoardForm";

export const BasicInput: React.FC<{ label: string; } & React.ComponentProps<"input">> = ({ label, value, defaultValue, ...inputProps }) => {
    const [inputValue, setInputValue] = useControllableState(value, defaultValue || '');

    return (
        <label style={{ display: 'flex', flexDirection: 'column', margin: '8px' }}>
            <span>{label} {defaultValue !== undefined && (
                <button
                    type="button"
                    style={{ ...linkButtonStyle, color: '#888', fontSize: '14px' }}
                    onClick={() => {
                        setInputValue(defaultValue);
                        // @ts-ignore
                        inputProps.onChange && inputProps.onChange({ target: { value: defaultValue } });
                    }}
                >
                    Suggested: {defaultValue}
                </button>
            )}</span>
            <input
                {...inputProps}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    inputProps.onChange && inputProps.onChange(e);
                }} />
        </label>
    );
};
