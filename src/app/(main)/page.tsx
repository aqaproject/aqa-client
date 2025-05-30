import CriteriaOverallChart from "@/components/chart/CriteriaOverallChart";
import UserProfileHome from "@/components/UserProfileHome";
import { HOME_INTRODUCTION } from "@/constants/home_introduction";
import { FilterProvider } from "@/contexts/FilterContext";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const SearchBar = dynamic(() => import("@/components/SearchBar"));
const FeatureCard = dynamic(() => import("@/components/FeatureCard"));

export default async function Home() {
	return (
		<FilterProvider>
			<div className=" pt-20">
				<Suspense fallback={<p>Loading searchbar...</p>}>
					<SearchBar />
				</Suspense>
				<UserProfileHome />
				<div className=" shadow-2xl rounded-2xl">
					<CriteriaOverallChart />
				</div>
				<div className="text-gray-400 columns-2 gap-14 mt-16 px-20">
					{HOME_INTRODUCTION.map((introduction) => (
						<Suspense
							key={introduction.title.link}
							fallback={<p>Loading feature</p>}
						>
							<FeatureCard introduction={introduction} />
						</Suspense>
					))}
				</div>
			</div>
		</FilterProvider>
	);
}
