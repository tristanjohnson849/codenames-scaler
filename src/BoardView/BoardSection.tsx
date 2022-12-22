import React, { useState } from "react";
import Collapsible from "react-collapsible";
import CollapseButton from "../BoardForm/CollapseButton";
import { PAGE_SECTION_STYLE } from "../BoardGenerator";
import SingleBoardView from "./SingleBoardView";
import { DisplayableLayout } from "../BoardLayout";

interface BoardSectionProps {
    layout: DisplayableLayout
    teamName: string;
    defaultOpen?: boolean;
}
const BoardSection: React.FC<BoardSectionProps> = ({ teamName, layout, defaultOpen = false }) => {
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
        } }
        containerElementProps={{
            style: PAGE_SECTION_STYLE
        }}
    >
        <SingleBoardView layout={layout} />
    </Collapsible>;
};

export default BoardSection;