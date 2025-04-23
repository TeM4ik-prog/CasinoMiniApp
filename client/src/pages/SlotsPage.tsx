import { Slots } from "@/components/games/Slots";
import { PageContainer } from "@/components/layout/PageContainer";

const SlotsPage: React.FC = () => {
    return (
        <PageContainer>
            <div className="w-full max-w-[1920px] mx-auto px-4 py-6">
                <Slots />
            </div>
        </PageContainer>
    );
};

export default SlotsPage; 