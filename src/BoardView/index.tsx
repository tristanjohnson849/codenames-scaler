import React from "react";
import { AnyBoardLayout, CardType, DisplayableLayout, DuetLayout, StandardLayout } from "../BoardLayout";
import { PAGE_SECTION_STYLE } from "../BoardGenerator";
import BoardSection from "./BoardSection";


export interface BoardProps {
    layout: AnyBoardLayout;
};

export const typeToColor: { [K in CardType]: string } = {
    Blue: '#268bad',
    Red: '#c9461d',
    Bystander: '#af926e',
    Assassin: '#1b1b1b',
    DuetCorrect: '#4CBB17'
}

const BoardView: React.FC<BoardProps> = ({layout}) => (
    layout.mode === 'Standard'
        ? <BoardSection defaultOpen={true} teamName="Codemasters" layout={layout as StandardLayout}/>
        : <DuetBoardView layout={layout as DuetLayout}/>
);

const DuetBoardView: React.FC<{layout: DuetLayout}> = ({layout}) => {
    return (
        <>
            <BoardSection teamName="Team 1" layout={getDisplayableDuetLayout(layout, 0)}/>
            <BoardSection teamName="Team 2" layout={getDisplayableDuetLayout(layout, 1)}/>
            {layout.info && <div style={PAGE_SECTION_STYLE}>
                <h3>Board Info</h3>
                <ul>
                    {layout.info.map(item => <li style={{ margin: '8px 0'}}>{item}</li>)}
                </ul>
            </div>}
        </>
    );
};

const getDisplayableDuetLayout = (layout: DuetLayout, teamNumber: number): DisplayableLayout => ({
    ...layout,
    cards: layout.cards.map(row => row.map(cell => cell[teamNumber])),
    startColor: 'DuetCorrect'
});

export default BoardView;
