import React, { CSSProperties } from "react";


export interface InputCardProps {
    title: string;
    style?: CSSProperties;
}

export const InputCard: React.FC<InputCardProps> = ({ title, style = {}, children }) => {
    return (
        <div style={{ marginLeft: '24px', marginBottom: '24px', maxWidth: '33%', minWidth: '180px', ...style }}>
            <div style={{ paddingLeft: '16px', paddingBottom: '8px' }}><b>{title}</b></div>
            <div style={{
                border: '1px solid #555',
                padding: '16px',
                borderRadius: '16px',
                boxShadow: '6px 6px 8px #2b2b2b',
            }}>
                {children}
            </div>
        </div>
    );
};
