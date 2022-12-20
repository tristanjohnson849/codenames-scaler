import React, { useState } from 'react';
import BoardView, { CardType } from './BoardView';
import BoardForm, { CodenamesFormData } from './BoardForm/BoardForm';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { createLayout, decodeFormData, encodeFormData, getStartColor } from './BoardEncoding';

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
            <BoardForm formData={formData} setFormData={(formData) => setFormDataAndHash(formData)}/>
            {formData && <BoardView key={encodeFormData(formData)} layout={createLayout(formData)}/>}
        </div>
    );
}

export default BoardGenerator;
