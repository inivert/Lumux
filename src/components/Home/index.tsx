import Hero from "./Hero";
import Features from "./Features";
import FeaturesWithImage from "./FeaturesWithImage";
import Counter from "./Counter";
import CallToAction from "./CallToAction";
import Pricing from "./Pricing";
import FAQ from "./FAQ";

import { integrations } from "../../../integrations.config";

const Home = () => {
	return (
		<>
			<Hero />
			<Features />
			<FeaturesWithImage />
			<Counter />
			<CallToAction />
			<Pricing />
			<FAQ />
		</>
	);
};

export default Home;
