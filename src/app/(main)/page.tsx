import CriteriaOverallChart from "@/components/chart/CriteriaOverallChart";
import { HOME_INTRODUCTION } from "@/constants/home_introduction";
import { FilterProvider } from "@/contexts/FilterContext";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const SearchBar = dynamic(() => import("@/components/SearchBar"));
const FeatureCard = dynamic(() => import("@/components/FeatureCard"));

export default async function Home() {
	return (
		<FilterProvider>
			<div className="pt-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
				<div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
					<Suspense fallback={<p>Loading search bar...</p>}>
						<SearchBar />
					</Suspense>
				</div>

				<div className="max-w-6xl mx-auto px-4 mt-8">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
						Điểm đánh giá tổng quan
					</h2>
					<CriteriaOverallChart />
				</div>

				<div className="max-w-6xl mx-auto px-4 mt-10">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
						Các chức năng chính
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{HOME_INTRODUCTION.map((introduction) => (
							<Suspense
								key={introduction.title.link}
								fallback={<p>Loading feature...</p>}
							>
								<FeatureCard introduction={introduction} />
							</Suspense>
						))}
					</div>
				</div>
			</div>
		</FilterProvider>
	);
}
