import Collapsible from "react-collapsible";

interface CollapseButtonProps {
    isOpen: boolean;
    label?: string;
    closeLabelOnOpen?: boolean
}

export const COLLAPSIBLE_EASING = "cubic-bezier(.5,.9,.2,1.0)";
export const COLLAPSIBLE_TIME = 400;

const CollapseButton = ({isOpen, label, closeLabelOnOpen = true}: CollapseButtonProps) => {
    return (
        <div style={{ 
            position: 'relative',
            fontSize: '24px',
            cursor: 'pointer',
            marginLeft: '16px',
            marginBottom: isOpen && !closeLabelOnOpen ? '16px' : undefined
        }}>
            {closeLabelOnOpen 
                ? <Collapsible
                    trigger=""
                    open={!isOpen}
                    transitionTime={COLLAPSIBLE_TIME}
                    easing={COLLAPSIBLE_EASING}
                >{label}</Collapsible>
                : label
            }
            <div
                style={{
                    position: 'absolute',
                    padding: '8px',
                    top: '-12px',
                    right: '2px',
                    display: 'block',
                    transition: 'transform 300ms',
                    transform: isOpen ? 'rotateZ(180deg)' : ''
                }}
            >⋁</div>
        </div>
    );
}

export default CollapseButton;