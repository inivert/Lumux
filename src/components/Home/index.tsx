import Hero from "./Hero";
import Features from "./Features";
import FeaturesWithImage from "./FeaturesWithImage";
import FaqSection from "@/components/Common/FaqSection";
import Counter from "./Counter";
import CallToAction from "./CallToAction";
import Pricing from "./Pricing";
import FAQ from "./FAQ";
import Blog from "./Blog";

import { integrations } from "../../../integrations.config";

const Home = () => {
	return (
		<>
			<Hero />
			<Features />
			<FeaturesWithImage />
			<FaqSection />
			<Counter />
			<CallToAction />
			<Pricing />
			<FAQ />
			{integrations?.isSanityEnabled && <Blog />}
		</>
	);
};

export default Home;
