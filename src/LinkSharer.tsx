import { useState } from "react";
import { ReactComponent as CopyIcon } from './img/copy.svg';
import { ReactComponent as ShareIcon } from './img/share.svg';

export interface LinkSharerProps {

}

const iconStyle = {
    width: '18px',
    height: '18px',
    marginLeft: '12px',
    cursor: 'pointer',
    paddingTop: '8px'
}

const LinkSharer: React.FC<LinkSharerProps> = () => {
    const [copied, setCopied] = useState<number>(0);
    return (
            <div style={{
                marginBottom: '48px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                minWidth: '634px'
            }}>
                <input disabled value={window.location.href} style={{
                    minWidth: '546px'
                }}/>
                <div style={{position: 'relative'}}>
                    <CopyIcon 
                        style={iconStyle} 
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(prev => prev + 1);
                        }}
                    />
                    {(copied || null) && <div key={copied} style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        bottom: '-24px', 
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        animationName: 'fadeOut',
                        animationDuration: '2s',
                        animationFillMode: 'forwards',
                        textAlign: 'right'
                    }}>
                        Copied to clipboard
                    </div>}
                </div>
                {navigator['share'] && <ShareIcon style={iconStyle} onClick={() => {
                    navigator.share({
                        title: 'Codenames Board Link',
                        text: 'Codenames Board Link',
                        url: window.location.href,
                    });
                }}/>}
            </div>

    );
};

export default LinkSharer;