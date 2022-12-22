import React from "react";
import { BoardLayout } from "../BoardEncoding";
import { PAGE_SECTION_STYLE } from "../BoardGenerator";
import BoardSection from "./BoardSection";


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

export default BoardView;
