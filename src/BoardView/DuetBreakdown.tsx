import React from "react";
import { typeToColor } from '.';
import { PAGE_SECTION_STYLE } from "../BoardGenerator";
import { CardType } from '../BoardLayout';
import { DuetLayout } from '../BoardLayout';

const SORT_ORDER: CardType[][] = [
    ['DuetCorrect', 'DuetCorrect'],
    ['DuetCorrect', 'Assassin'],
    ['Assassin', 'DuetCorrect'],
    ['DuetCorrect', 'Bystander'],
    ['Bystander', 'DuetCorrect'],
    ['Assassin', 'Assassin'],
    ['Assassin', 'Bystander'],
    ['Bystander', 'Assassin'],
    ['Bystander', 'Bystander'],
];

function customSortBy<T, O>(
    arr: T[],
    customOrdering: O[],
    transform: (t: T) => O,
    fallback: (t1: T, t2: T) => number = () => 0
): T[] {
    const index = Object.fromEntries(customOrdering.map((o, i) => [o, i]));
    return arr.sort((t1: T, t2: T) => (index[t1] - index[t2]) || fallback(t1, t2));
}

function customSort<T>(
    arr: T[],
    customOrdering: T[],
    fallback: (t1: T, t2: T) => number = () => 0
): T[] {
    return customSortBy(arr, customOrdering, (t) => t, fallback);
}

const DuetBreakdown = ({ layout }: { layout: DuetLayout }) => {

    const sortedCards = customSort(layout.cards.flatMap((row) => row), SORT_ORDER);

    return (
        <div style={{
            ...PAGE_SECTION_STYLE,
            display: 'flex',
            padding: '8px',
            marginBottom: '0',
            height: '60px',
        }}>
            {sortedCards.map(([team1Card, team2Card]) => (
                <div style={{
                    display: 'flex',
                    flexGrow: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <MiniCard cardType={team1Card} />
                    <hr style={{ height: '12px'}}/>
                    <MiniCard cardType={team2Card} />
                </div>
            ))}
        </div>
    );
};

const MiniCard = ({ cardType }: { cardType: CardType }) => (
    <div
        style={{
            background: typeToColor[cardType],
            borderRadius: '2px',
            margin: '0 4px',
            flexGrow: 1
        }}
    />
);


export default DuetBreakdown;