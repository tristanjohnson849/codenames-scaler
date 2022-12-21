import React, { useState } from "react";
import Collapsible from "react-collapsible";
import { BoardLayout } from "./BoardEncoding";
import CollapseButton from "./BoardForm/CollapseButton";
import { PAGE_SECTION_STYLE } from "./BoardGenerator";

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


const SingleBoardView: React.FC<{cards: CardType[][], startColor: CardType}> = ({ cards, startColor }) => (
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
        boxShadow: '8px 8px 12px #2b2b2b'
    }}>
        <HLight isTop={true} color={startColor} />
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
            padding: '8px',
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
);

const DuetBoardView: React.FC<{cards: CardType[][][], info?: string[]}> = ({ cards, info}) => {
    return (
        <>
            <BoardSection teamName="Team 1" startColor="DuetCorrect" cards={cards.map(row => row.map(cell => cell[0]))}/>
            <BoardSection teamName="Team 2" startColor="DuetCorrect" cards={cards.map(row => row.map(cell => cell[1]))}/>
            {info && <div style={{
                    margin: 'auto',
                    border: '1px solid #555',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: '8px 8px 12px #2b2b2b'
                }}>
                <h3>Board Info</h3>
                <ul>
                    {info.map(item => <li style={{ margin: '8px 0'}}>{item}</li>)}
                </ul>
            </div>}
        </>
    );
};

const HLight: React.FC<{ isTop: boolean, color?: CardType }> = ({ isTop, color = 'Bystander' }) => {
    const lightColor = typeToColor[color];
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
