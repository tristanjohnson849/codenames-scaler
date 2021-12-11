import React from "react";

export type CardType = 'Blue' | 'Red' | 'Bystander' | 'Assassin';

export interface BoardProps {
    layout: CardType[][];
    startColor?: 'Red' | 'Blue';
};

const typeToColor: { [K in CardType]: string } = {
    Blue: '#0062cc',
    Red: '#e3242b',
    Bystander: '#bfaa8c',
    Assassin: '#1b1b1b',
}

const HLight: React.FC<{ isTop: boolean, color?: 'Blue' | 'Red' }> = ({ isTop, color }) => {
    const lightColor = color ? typeToColor[color] : '#FFE800';
    return <div style={{
        position: 'absolute',
        top: isTop ? 0 : undefined,
        bottom: isTop ? undefined : 0,
        left: '40%',
        height: '32px',
        width: '20%',
        margin: 'auto',
        transform: `perspective(10px) rotateX(${isTop ? '-' : ''}1deg)`,
        borderRadius: isTop ? '4px 4px 8px 8px' : '8px 8px 4px 4px',
        background: `linear-gradient(to right, ${lightColor} 5%, #FFF 45%, #FFF 55%, ${lightColor} 95%)`,
    }} />;
};

const VLight: React.FC<{ isLeft: boolean, color?: 'Blue' | 'Red' }> = ({ isLeft, color }) => {
    const lightColor = color ? typeToColor[color] : '#FFE800';
    return <div style={{
        position: 'absolute',
        left: isLeft ? 0 : undefined,
        right: isLeft ? undefined : 0,
        top: '40%',
        height: '20%',
        width: '32px',
        margin: 'auto',
        transform: `perspective(10px) rotateY(${isLeft ? '' : '-'}1deg)`,
        borderRadius: isLeft ? '4px 8px 8px 4px' : '8px 4px 4px 8px',
        background: `linear-gradient(to bottom, ${lightColor} 5%, #FFF 45%, #FFF 55%, ${lightColor} 95%)`,
    }} />
};

const BoardView: React.FC<BoardProps> = ({ layout, startColor }) => (
    <div style={{
        position: 'relative',
        display: 'flex',
        width: '80vh',
        height: '80vh',
        margin: 'auto',
        padding: '32px',
        background: '#434343',
        borderRadius: '12px',
        border: '1px solid #777',
        boxShadow: '8px 8px 12px #2b2b2b',
    }}>
        <HLight isTop={true} color={startColor} />
        <HLight isTop={false} color={startColor} />
        <VLight isLeft={true} color={startColor} />
        <VLight isLeft={false} color={startColor} />
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            background: '#2b2b2b',
            border: '1px solid #777',
            padding: '8px',
        }}>
            {layout.map((row) =>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 1
                }}>
                    {row.map((cellType) =>
                        <div style={{
                            flex: 1,
                            background: typeToColor[cellType],
                            margin: '4px',
                            borderRadius: '12px',
                            boxShadow: '6px 6px 8px #1c1c1c',
                            border: '1px solid #555'
                        }} />
                    )}
                </div>
            )}
        </div>
    </div>
);

export default BoardView;