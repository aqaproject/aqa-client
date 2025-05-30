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
import { useDeepCompareEffect } from "react-use";

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

	useDeepCompareEffect(() => {
		let isAbort = false;

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
			const currentData = response.data?.groupedPoints.data || [];
			const averageResponse = await fetchFunction({
				variables: {
					groupEntity: "Semester",
				},
				fetchPolicy: "no-cache",
			});
			const averageData = averageResponse.data?.groupedPoints.data;
			const newData = currentData.map((data) => ({
				...data,
				all_average:
					averageData?.find((d) => d.id === data.id)?.average_point || 0,
			}));
			if (isAbort) return;
			setData(newData);
			setLoading(false);
		})();

		return () => {
			isAbort = true;
		};
	}, [query, variables]);

	return (
		<div className=" h-[600px]">
			<ChartLayout
				primaryTitle={title}
				secondaryTitle={""}
				legends={[legend]}
				colors={["sky"]}
				isFullWidth
				handlerButtons={selectors}
			>
				<AreaChart
					className=" h-full"
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
										"Trung bình toàn trường":
											point.all_average * 4,
										semester_name: point.display_name,
									})) || []
					}
					index="semester_name"
					categories={
						displayAverage
							? ["Điểm", "Trung bình toàn trường"]
							: ["Điểm"]
					}
					colors={["sky", "purple"]}
					yAxisWidth={80}
					minValue={3.3}
					showAnimation
					rotateLabelX={{
						angle: 0,
						verticalShift: 10,
						xAxisHeight: 40,
					}}
					margin={{ bottom: 50 }}
					valueFormatter={(number: number) => {
						return `${number.toFixed(2)}`;
					}}
					showLegend
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
