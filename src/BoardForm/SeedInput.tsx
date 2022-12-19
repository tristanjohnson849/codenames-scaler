import React from "react";
import { useControllableState, randomSeed, linkButtonStyle } from "./BoardForm";

export const SeedInput: React.FC<React.ComponentProps<"input">> = ({ key, value, onChange, ...inputProps }) => {
    const [seed, setSeed] = useControllableState(value, randomSeed());

    return (
        <div>
            <div>
                Seed
                <button
                    type="button"
                    style={{ ...linkButtonStyle, color: '#888', fontSize: '14px' }}
                    onClick={() => {
                        const newSeed = randomSeed();
                        setSeed(newSeed);
                        // @ts-ignore
                        onChange && onChange({ target: { value: newSeed } });
                    }}
                >
                    New Seed
                </button>
            </div>
            <input
                {...inputProps}
                type="text"
                value={seed}
                onChange={(e) => {
                    setSeed(e.target.value);
                    onChange && onChange(e);
                }} />
        </div>
    );
};
