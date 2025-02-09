"use client";

import ChartLayout from "@/components/chart/ChartLayout";
import { FilterProvider, useFilter } from "@/contexts/FilterContext";
import {
	FilterArgs,
	GroupedPoint,
	Role,
	usePointsWithGroupByLazyQuery,
	useProfileQuery,
} from "@/gql/graphql";
import { ReactNode, useEffect, useState } from "react";
import { ComboChart } from "../ComboChart";

type Props = {
	title: string;
	groupEntity: string;
	legend?: string;
	selectors?: ReactNode;
	query?: FilterArgs;
	xTitle?: string;
	averageTitle?: string;
	onClick?: (item: GroupedPoint) => any;
};

function InnerPointWithGroupedEntity({
	title,
	legend = "Điểm",
	selectors = <></>,
	query = {},
	xTitle = "Điểm",
	averageTitle = "Trung bình",
	groupEntity,
	onClick = () => {},
}: Props) {
	const filter = useFilter();

	const [data, setData] = useState<GroupedPoint[]>([]);
	const [loading, setLoading] = useState(false);

	const { data: profile } = useProfileQuery();

	const variables: FilterArgs & { groupEntity: string } = {
		criteria_id: filter.criteria?.criteria_id,
		faculty_id:
			profile?.profile.role === Role.Faculty
				? profile.profile.faculty?.faculty_id
				: filter.faculty?.faculty_id,
		semester_id: filter.semester?.semester_id,
		subjects: Array.from(filter.subjects.values()).length
			? Array.from(filter.subjects.values()).map(
					(subject) => subject.subject_id
			  )
			: undefined,
		program: filter.program,
		groupEntity: "Semester",
	};

	const [fetchFunction] = usePointsWithGroupByLazyQuery();

	useEffect(() => {
		(async () => {
			if (!profile) return;
			setLoading(true);
			const response = await fetchFunction({
				variables: {
					...query,
					...Object.fromEntries(
						Object.entries(variables).filter(([key, value]) => !!value)
					),
					[`${groupEntity.toLowerCase()}_id`]: undefined,
					groupEntity: groupEntity,
				},
				fetchPolicy: "network-only",
			});
			setData(response.data?.groupedPoints.data || []);
			setLoading(false);
		})();
	}, [JSON.stringify(query), JSON.stringify(variables), profile]);

	const averagePoint =
		data.reduce((total, value) => (total += value.average_point * 4), 0) /
		data.length;

	const chartData =
		[...data]
			.sort((a, b) => b.average_point - a.average_point)
			.map((point) => ({
				[xTitle]: point.average_point * 4,
				[averageTitle]: averagePoint,
				name: point.display_name,
			})) || [];

	return (
		<div className="">
			<ChartLayout
				primaryTitle={title}
				secondaryTitle={""}
				legends={[legend]}
				colors={["sky"]}
				columnNum={data.length || 0}
				columnSize={100}
				isFullWidth
				handlerButtons={selectors}
			>
				<ComboChart
					data={chartData}
					index="name"
					enableBiaxial={false}
					showLegend={false}
					barSeries={{
						categories: [xTitle],
						yAxisLabel: "",
						colors: ["sky"],
						minValue: 3,
						maxValue: 4,
						yAxisWidth: 60,
						valueFormatter: (number: number) => {
							return `${number.toFixed(2)}`;
						},
					}}
					lineSeries={{
						categories: [averageTitle],
						showYAxis: true,
						yAxisLabel: "",
						colors: ["pink"],
						minValue: 3,
						maxValue: 4,
						valueFormatter: (number: number) => {
							return `${number.toFixed(2)}`;
						},
					}}
				/>
			</ChartLayout>
		</div>
	);
}

export default function PointWithGroupedEntity(props: Props) {
	return (
		<FilterProvider>
			<InnerPointWithGroupedEntity {...props} />
		</FilterProvider>
	);
}
