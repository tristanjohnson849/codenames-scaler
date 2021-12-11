import React, { useState } from 'react';
import BoardView, { CardType } from './BoardView';
import BoardForm, { CodenamesFormData } from './BoardForm';
import chunk from 'lodash/chunk';
import fill from 'lodash/fill';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import SeedRandom from 'seed-random';

const formDataKeys: string[] = Object.keys({
    boardRows: 0,
    boardColumns: 0,
    cards: 0,
    startCards: 0,
    startColor: 'Random',
    assassins: 0,
    seed: ''
}).sort();

const encodeFormData = (formData: CodenamesFormData): string => {
    const orderedValues = Object.entries(formData).sort(([k1], [k2]) => k1.localeCompare(k2)).map(([_, v]) => v);
    return btoa(JSON.stringify(orderedValues));
}

const decodeFormData = (slug: string): CodenamesFormData | undefined => {
    let orderedValues: any[] = [];
    try {
        orderedValues = JSON.parse(atob(slug));
    } catch {
        return undefined;
    }
    if (orderedValues && orderedValues.length == formDataKeys.length) {
        const ret: any = {};
        formDataKeys.forEach((key, i) => ret[key] = orderedValues[i]);
        if (isValidFormData(ret)) {
            return ret;
        }
    }

    return undefined;
}

const BoardGenerator = () => {
    const params = useParams();
    const slug: string | undefined = params.slug;
    let initialFormData = undefined;
    if (slug) {
        initialFormData = decodeFormData(slug);
    }
    const [formData, setFormData] = useState<CodenamesFormData | undefined>(initialFormData);
    const navigate = useNavigate();

    const setFormDataAndHash = (newFormData: CodenamesFormData) => {
        setFormData(newFormData);
        navigate(`/${encodeFormData(newFormData)}`)
    }
    
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <h1 style={{ margin: '32px' }}>Codenames Board Generator</h1>
            <BoardForm initialFormData={initialFormData} onSubmit={(formData) => setFormDataAndHash(formData)}/>
            {formData && <BoardView layout={createLayout(formData)} startColor={getStartColor(formData)}/>}
        </div>
    );
}

const isValidFormData = (layout: any): boolean => (
    layout && 
    layout.boardRows && 
    layout.boardColumns && 
    layout.cards && 
    !isNaN(layout.startCards) && 
    !isNaN(layout.assassins) && 
    layout.seed
);

const getStartColor = (formData: CodenamesFormData): 'Blue' | 'Red' => {
    if (formData.startColor == 'Random') {
        return seededRandom(formData.seed + 'start', 0, 1) ? 'Blue' : 'Red';
    } else {
        return formData.startColor;
    }
}

const createLayout = ({
    boardRows,
    boardColumns,
    cards,
    startCards,
    startColor,
    assassins,
    seed
}: CodenamesFormData): CardType[][] => {
    const blueCards = cards + (startColor == 'Blue' ? startCards : 0);
    const redCards = cards + (startColor == 'Red' ? startCards : 0);

    const flatLayout: Array<CardType> = fill(Array(boardRows * boardColumns), 'Bystander');
    fill(flatLayout, 'Blue', 0, blueCards)
    fill(flatLayout, 'Red', blueCards, blueCards + redCards);
    fill(flatLayout, 'Assassin', blueCards + redCards, blueCards + redCards + assassins);

    shuffle(flatLayout, seed);

    return chunk(flatLayout, boardRows);
};

function shuffle<T>(arr: T[], seed: string): void {
    for (var i = arr.length - 1; i > 0; i--) {
        const j = seededRandom(i + seed, 0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

const seededRandom = (seed: string, min: number, max: number): number => {
    const rand = SeedRandom(seed);
    return Math.floor(rand() * (max - min + 1) + min);
};

export default BoardGenerator;
