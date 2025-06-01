"use client";

import ChartLayout from "@/components/chart/ChartLayout";
import PointWithGroupedEntity from "@/components/chart/PointWithGroupedEntity";
import { ComboChart } from "@/components/ComboChart";
import { FilterProvider } from "@/contexts/FilterContext";
import { useGetPointsByCategoryQuery } from "@/gql/graphql";
import { Button } from "@heroui/react";
import _ from "lodash";
import Link from "next/link";
import {} from "react-icons";

export default function Page() {
	const { data: points, loading: isLoading } = useGetPointsByCategoryQuery();

	return (
		<div>
			<div className=" flex items-center justify-between mb-8">
				<h1 className=" text-2xl font-bold">Dữ liệu khảo sát giảng viên</h1>
				<div className="flex gap-4">
					<Link href="/staff-survey/add">
						<Button color="primary">
							<p className=" font-semibold">Thêm dữ liệu mới</p>
						</Button>
					</Link>
					<Link href="/staff-survey/upload">
						<Button>
							<p className=" font-semibold">Tải dữ liệu lên</p>
						</Button>
					</Link>
				</div>
			</div>

			<div className=" flex flex-col gap-4">
				<FilterProvider>
					<ChartLayout
						primaryTitle="Điểm đánh giá giảng viên theo tiêu chí"
						secondaryTitle={""}
						legends={["Điểm đánh giá"]}
						colors={["sky"]}
						columnNum={points?.getPointsByCategory.length || 0}
						columnSize={100}
						isFullWidth
						handlerButtons={<></>}
					>
						<ComboChart
							data={(points?.getPointsByCategory ?? []).map(
								(point) => ({
									"Điểm đánh giá": point.avg_point,
									"Điểm trung bình":
										_.mean(
											points?.getPointsByCategory.map(
												(p) => p.avg_point
											)
										) || 0,
									name: point.category,
								})
							)}
							index="name"
							enableBiaxial={false}
							showLegend={false}
							barSeries={{
								categories: ["Điểm đánh giá"],
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
								categories: ["Điểm trung bình"],
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
				</FilterProvider>
			</div>
		</div>
	);
}
