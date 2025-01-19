import { Comment } from "./interfaces/IComment";
import { DualAxes } from "@ant-design/plots";

const CombinedBarLineChart = ({ data }: { data: Comment[] }) => {
	const barData = data.reduce<
		Record<string, { semester: string; aspect: string; value: number }>
	>((acc, curr) => {
		const key = `${curr.semester.display_name}-${curr.aspect}`;
		if (!acc[key]) {
			acc[key] = {
				semester: curr.semester.display_name,
				aspect: curr.aspect,
				value: 1,
			};
		} else {
			acc[key].value += 1;
		}
		return acc;
	}, {});
	// Convert and sort barChartData
	const barChartData = Object.values(barData).sort((a, b) =>
		a.semester.localeCompare(b.semester)
	);

	const lineData = data.reduce<
		Record<string, { semester: string; sentiment: string; value: number }>
	>((acc, curr) => {
		const key = `${curr.semester.display_name}-${curr.sentiment}`;
		if (!acc[key]) {
			acc[key] = {
				semester: curr.semester.display_name,
				sentiment: curr.sentiment,
				value: 1,
			};
		} else {
			acc[key].value += 1;
		}
		return acc;
	}, {});
	// Convert and sort lineChartData
	const lineChartData = Object.values(lineData).sort((a, b) =>
		a.semester.localeCompare(b.semester)
	);

	console.log("Bar Chart Data:", barChartData);
	console.log("Line Chart Data:", lineChartData);

	const config = {
		xField: "semester",
		children: [
			{
				data: barChartData,
				type: "interval",
				yField: "value",
				colorField: "aspect",
				group: true,
				style: { maxWidth: 80 },
				interaction: { elementHighlight: { background: true } },
			},
			{
				data: lineChartData,
				type: "line",
				yField: "value",
				shapeField: "smooth",
				colorField: "sentiment",
				style: { lineWidth: 2 },
				axis: { y: { position: "right" } },
				scale: { series: { independent: true } },
				interaction: {
					tooltip: {
						crosshairs: false,
						marker: false,
					},
				},
			},
		],
	};
	return (
		<div style={{ width: "100%", height: "400px" }}>
			<DualAxes {...config} />
		</div>
	);
};

export default CombinedBarLineChart;
