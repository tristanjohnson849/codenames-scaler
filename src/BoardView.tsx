import React, { CSSProperties, useState } from "react";
import Collapsible from "react-collapsible";
import { BoardLayout } from "./BoardEncoding";
import CollapseButton, { COLLAPSIBLE_EASING, COLLAPSIBLE_TIME } from "./BoardForm/CollapseButton";
import { PAGE_SECTION_STYLE } from "./BoardGenerator";

import { ReactComponent as RotateCounterClockwiseIcon } from './img/rotate-image.svg';

export type CardType = 'Blue' | 'Red' | 'Bystander' | 'Assassin' | 'DuetCorrect';

export interface BoardProps {
    layout: BoardLayout<CardType | CardType[]>;
};

export const typeToColor: { [K in CardType]: string } = {
    Blue: '#268bad',
    Red: '#c9461d',
    Bystander: '#af926e',
    Assassin: '#1b1b1b',
    DuetCorrect: '#4CBB17'
}

const BoardView: React.FC<BoardProps> = ({layout: { cards, mode, startColor, info }}) => (
    mode === 'Standard'
        ? <BoardSection defaultOpen={true} teamName="Codemasters" startColor={startColor} cards={cards as CardType[][]}/>
        : <DuetBoardView cards={cards as CardType[][][]} info={info}/>
);


const SingleBoardView: React.FC<{cards: CardType[][], startColor: CardType}> = ({ cards, startColor }) => {
    const [boardRotation, setBoardRotation] = useState<number>(0);

    const rotate = (counterClockwise: boolean) => setBoardRotation(prevRotation => 
        counterClockwise 
            ? prevRotation - 90
            : prevRotation + 90
        );
    // subtract rotation % 360 for correcct animations, if used 0 would spin through all rotations
    const resetRotation = () => setBoardRotation(prevRotation => prevRotation - (prevRotation % 360));
    return (
        <div style={{
            position: 'relative',
            padding: '0 48px'
        }}>
            <div style={{
                position: 'relative',
                display: 'flex',
                maxWidth: '720px',
                minWidth: '424px',
                aspectRatio: '1 / 1',
                margin: '18px auto',
                padding: '32px',
                background: '#434343',
                borderRadius: '12px',
                border: '1px solid #777',
                boxShadow: '8px 8px 12px #2b2b2b',
                transform: `rotate(${boardRotation}deg)`,
                transition: `transform ${COLLAPSIBLE_TIME} ${COLLAPSIBLE_EASING}`
            }}>
                <HLight isTop={true} color={startColor} resetRotation={resetRotation} />
                <HLight isTop={false} color={startColor} />
                <VLight isLeft={true} color={startColor} />
                <VLight isLeft={false} color={startColor} />
                <div style={{
                    minWidth: '360px',
                    flex: 1,
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    background: '#2b2b2b',
                    border: '1px solid #777',
                    padding: '8px'
                }}>
                    {cards.map((row, colIndex) =>
                        <div key={colIndex} style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flex: 1
                        }}>
                            {row.map((cellType, rowIndex) =>
                                <div key={`${colIndex}-${rowIndex}`} style={{
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
            <RotateButton rotate={rotate} counterClockwise={true} style={{ position: 'absolute', bottom: '8px', left: '8px' }} />
            <RotateButton rotate={rotate} counterClockwise={false} style={{ position: 'absolute', bottom: '8px', right: '8px' }} />
        </div>
    );
};

interface RotateButtonProps {
    rotate: (counterClockwise: boolean) => void;
    counterClockwise?: boolean;
    style?: CSSProperties;
}

const RotateButton: React.FC<RotateButtonProps> = ({ 
    rotate,
    counterClockwise = true, 
    style={}
}) => {
    return (
        <RotateCounterClockwiseIcon 
            onClick={() => rotate(counterClockwise)}
            style={{
                width: '24px',
                height: '24px',
                transform: counterClockwise ? '': 'scaleX(-1)',
                cursor: 'pointer',
                ...style
            }} 
        />
    );
}

const DuetBoardView: React.FC<{cards: CardType[][][], info?: string[]}> = ({ cards, info}) => {
    return (
        <>
            <BoardSection teamName="Team 1" startColor="DuetCorrect" cards={cards.map(row => row.map(cell => cell[0]))}/>
            <BoardSection teamName="Team 2" startColor="DuetCorrect" cards={cards.map(row => row.map(cell => cell[1]))}/>
            {info && <div style={PAGE_SECTION_STYLE}>
                <h3>Board Info</h3>
                <ul>
                    {info.map(item => <li style={{ margin: '8px 0'}}>{item}</li>)}
                </ul>
            </div>}
        </>
    );
};

const HLight: React.FC<{ isTop: boolean, color?: CardType, resetRotation?: () => void }> = ({ isTop, resetRotation = null, color = 'Bystander' }) => {
    const lightColor = typeToColor[color];
    return (<>
        <div style={{
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
            zIndex: 2
        }}/>
        {resetRotation && (
            <div 
                style={{
                    position: 'absolute',
                    top: isTop ? 0 : undefined,
                    bottom: isTop ? undefined : 0,
                    left: '35%',
                    height: '32px',
                    width: '30%',
                    margin: 'auto',
                    zIndex: 1,
                    cursor: 'pointer'
                }} 
                onClick={resetRotation}
            >
                <div style={{
                    width: '100%',
                    transform: `perspective(10px) rotateX(${isTop ? '-' : ''}1deg)`,
                    borderRadius: isTop ? '4px 4px 8px 8px' : '8px 8px 4px 4px',
                    background: `#363636`,
                    height: '32px',
                }}/>
                <div style={{ position: 'absolute', transform: 'rotateZ(180deg)', left: '16px', top: '4px'}}>⋁</div>
                <div style={{ position: 'absolute', transform: 'rotateZ(180deg)', right: '16px', top: '4px'}}>⋁</div>
            </div>
        )}
    </>);
};

const VLight: React.FC<{ isLeft: boolean, color?: CardType }> = ({ isLeft, color = 'Bystander' }) => {
    const lightColor = typeToColor[color];
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

interface BoardSectionProps {
    teamName: string;
    cards: CardType[][];
    startColor: CardType;
    defaultOpen?: boolean;
}

const BoardSection = ({teamName, cards, startColor, defaultOpen = false }: BoardSectionProps) => {
    const [isBoardOpen, setIsBoardOpen] = useState<boolean>(defaultOpen);
    return <Collapsible
        tabIndex={0}
        trigger={<CollapseButton label={teamName} isOpen={isBoardOpen} closeLabelOnOpen={false} />}
        open={isBoardOpen}
        handleTriggerClick={() => {
            if (!isBoardOpen && window.confirm(`For ${teamName}'s eyes only - are you sure?`)) {
                setIsBoardOpen(true);
            }
            if (isBoardOpen) {
                setIsBoardOpen(false);
            }
        }}
        containerElementProps={{
            style: PAGE_SECTION_STYLE
        }}
    >
        <SingleBoardView cards={cards} startColor={startColor} />
    </Collapsible>;
}

export default BoardView;
