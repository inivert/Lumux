import { FeatureWithImg } from "@/types/featureWithImg";
import featureItemData from "./featuresData";
import FeatureItem from "./FeatureItem";
import SectionHeader from "@/components/Common/SectionHeader";

const FeaturesWithImage = () => {
	return (
		<section className='overflow-hidden py-17.5 lg:py-22.5 xl:py-27.5'>
			{/* <!-- section title --> */}
			<SectionHeader
				title={"Expert Independent Web Development"}
				description='I build and maintain your perfect website with personal attention to every detail. Get direct access to experienced development while you focus on your business.'
			/>

			<div className='mx-auto w-full max-w-[1040px] px-4 sm:px-8 xl:px-0'>
				{featureItemData?.map((item: FeatureWithImg, key: number) => (
					<FeatureItem data={item} key={key} />
				))}
			</div>
		</section>
	);
};

export default FeaturesWithImage;
