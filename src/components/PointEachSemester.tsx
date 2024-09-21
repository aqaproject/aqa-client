"use client";

import { FilterProvider, useFilter } from "@/contexts/FilterContext";
import {
	FilterArgs,
	GroupedPoint,
	usePointsEachSemesterLazyQuery,
} from "@/gql/graphql";
import { AreaChart } from "@tremor/react";
import { ReactNode, useEffect, useState } from "react";
import ChartLayout from "./chart/ChartLayout";
import Loading from "./Loading";
import NoData from "./NoData";

type Props = {
	title?: string;
	legend?: string;
	selectors?: ReactNode;
	query?: FilterArgs;
	displayAverage?: boolean;
};

function InnerPointEachSemester({
	title = "Điểm trung bình qua các học kỳ",
	legend = "Điểm",
	selectors = <></>,
	query = {},
	displayAverage = true,
}: Props) {
	const filter = useFilter();

	const [data, setData] = useState<(GroupedPoint & { all_average: number })[]>([]);
	const [loading, setLoading] = useState(false);

	const variables: FilterArgs & { groupEntity: string } = {
		criteria_id: filter.criteria?.criteria_id,
		faculty_id: filter.faculty?.faculty_id,
		semester_id: filter.semester?.semester_id,
		subjects: Array.from(filter.subjects.values()).length
			? Array.from(filter.subjects.values()).map(
					(subject) => subject.subject_id
			  )
			: undefined,
		program: filter.program,
		groupEntity: "Semester",
	};

	const [fetchFunction] = usePointsEachSemesterLazyQuery();

	useEffect(() => {
		(async () => {
			setLoading(true);
			const response = await fetchFunction({
				variables: {
					...query,
					...Object.fromEntries(
						Object.entries(variables).filter(([key, value]) => value)
					),
					groupEntity: "Semester",
				},
				fetchPolicy: "cache-and-network",
			});
			const averageResponse = await fetchFunction({
				variables: {
					groupEntity: "Semester",
				},
				fetchPolicy: "cache-and-network",
			});
			const averageData = averageResponse.data?.groupedPoints.data;
			setData(
				(response.data?.groupedPoints.data || []).map((data) => ({
					...data,
					all_average:
						averageData?.find((d) => d.id === data.id)?.average_point ||
						0,
				}))
			);
			setLoading(false);
		})();
	}, [JSON.stringify(query), JSON.stringify(variables)]);

	return (
		<div className=" h-[400px]">
			<ChartLayout
				primaryTitle={title}
				secondaryTitle={""}
				legends={[legend]}
				colors={["sky"]}
				isFullWidth
				handlerButtons={selectors}
			>
				<AreaChart
					className=" h-full mt-4"
					data={
						loading
							? []
							: [...data]
									.sort((a, b) => {
										const [semesterA, yearA] =
											a.display_name?.split(", ") || [0, 0];
										const [semesterB, yearB] =
											b.display_name?.split(", ") || [0, 0];
										if (yearA == yearB) {
											return (
												parseInt(
													semesterA.toString().at(-1) ||
														"",
													10
												) -
												parseInt(
													semesterB.toString().at(-1) ||
														"",
													10
												)
											);
										} else {
											return (
												parseInt(yearA.toString(), 10) -
												parseInt(yearB.toString(), 10)
											);
										}
									})
									.map((point) => ({
										Điểm: point.average_point * 4,
										"Trung bình": point.all_average * 4,
										semester_name: point.display_name,
									})) || []
					}
					index="semester_name"
					categories={displayAverage ? ["Điểm", "Trung bình"] : ["Điểm"]}
					colors={["sky", "fuchsia"]}
					yAxisWidth={80}
					minValue={3.3}
					showAnimation
					rotateLabelX={{
						angle: 0,
						verticalShift: 30,
						xAxisHeight: 50,
					}}
					valueFormatter={(number: number) => {
						return `${number.toFixed(2)}`;
					}}
					showLegend={false}
					//@ts-ignore
					noDataText={loading ? <Loading /> : <NoData />}
				/>
			</ChartLayout>
		</div>
	);
}

export default function PointEachSemester({
	title,
	legend,
	selectors,
	query,
}: Props) {
	return (
		<FilterProvider>
			<InnerPointEachSemester
				title={title}
				legend={legend}
				selectors={selectors}
				query={query}
			/>
		</FilterProvider>
	);
}
