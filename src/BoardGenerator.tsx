import { CSSProperties, Dispatch, SetStateAction, useState } from 'react';
import BoardView from './BoardView';
import BoardForm, { CodenamesFormData } from './BoardForm/BoardForm';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { decodeFormData, encodeFormData } from './BoardEncoding';
import { createLayout } from "./BoardLayout";
import LinkSharer from './LinkSharer';
import MegaMultiSlider from './BoardForm/MegaMultiSlider';

export const PAGE_SECTION_STYLE: CSSProperties = {
    marginBottom: '48px',
    border: '1px solid #555',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '8px 8px 12px #2b2b2b',
    minWidth: '586px',
    flexGrow: 1,
};

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

    const [cards, setCards] = useState<number>(9);
    const [assassins, setAssassins] = useState<number>(3);
    const [bystanders, setBystanders] = useState<number>(13);

    const changes: { [name: string]: Dispatch<SetStateAction<number>> } = {
        cards: setCards,
        assassins: setAssassins,
        bystanders: setBystanders
    }
    
    return (
        <div style={{ height: '100%', margin: '48px' }}>
            <h1>Codenames Board Generator</h1>
            <a 
                href="https://github.com/tristanjohnson849/codenames-scaler"
                style={{ 
                    position: 'absolute',
                    margin: '60px',
                    top: '0px', 
                    right: '0px', 
                    color: '#777', 
                    fontSize: '18px',
                    textDecoration: 'none'
                }}
                target="blank"
            >
                Source
            </a>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                maxWidth: '1000px',
                margin: 'auto'
            }}>
                <div style={PAGE_SECTION_STYLE}>
                    <div>Cards: {cards}</div>
                    <div>Assassins: {assassins}</div>
                    <div>Bystanders: {bystanders}</div>
                    <MegaMultiSlider 
                        regions={[
                            {
                                name: 'cards',
                                label: 'Team Cards',
                                cardType: 'DuetCorrect',
                                defaultValue: 9,
                            }, {
                                name: 'assassins',
                                label: 'Assassins',
                                cardType: 'Assassin',
                                defaultValue: 3,
                            }, {
                                name: 'bystanders',
                                label: 'Bystanders',
                                cardType: 'Bystander',
                                defaultValue: 13,
                            },
                        ]}
                        maxValue={25}
                        onIntegerChange={(name: string, value: number) => changes[name](value)}
                    />
                </div>
                <BoardForm formData={formData} setFormData={(formData) => setFormDataAndHash(formData)}/>
                {formData && <LinkSharer/>}
                {formData && <BoardView layout={createLayout(formData)}/>}
            </div>
        </div>
    );
}

export default BoardGenerator;
