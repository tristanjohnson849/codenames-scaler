import React from "react";
import { useControllableState, linkButtonStyle } from "./BoardForm";

export const RadioInput: React.FC<{ title?: string; labels: string[]; } & React.ComponentProps<"input">> = ({ title, labels, value, defaultValue, onChange, style = {}, ...inputProps }) => {
    const [checkedLabel, setCheckedLabel] = useControllableState(value, defaultValue || labels[0]);

    return (
        <div style={style}>
            {(title || defaultValue !== undefined) && <>
                <div>
                    {title}
                    {defaultValue !== undefined && (
                        <button
                            type="button"
                            style={{ ...linkButtonStyle, color: '#888', fontSize: '14px' }}
                            onClick={() => {
                                // @ts-ignore
                                onChange && onChange({ target: { value: defaultValue } });
                                setCheckedLabel(defaultValue);
                            }}
                        >
                            Suggested: {defaultValue}
                        </button>
                    )}
                </div>
                <hr />
            </>}
            {labels.map((label) => (
                <label style={{ marginRight: '6px' }}>{label}
                    <input
                        type="radio"
                        value={label}
                        checked={label === checkedLabel}
                        onChange={(e) => {
                            setCheckedLabel(label);
                            onChange && onChange(e);
                        }}
                        {...inputProps} />
                </label>
            ))}
        </div>
    );
};
