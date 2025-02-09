export const processChartData = (data: any[]) => {
	const barData: any[] = [];
	const lineData: any = {};

	data.forEach((comment) => {
		const semester = comment.semester.display_name;
		const aspect = comment.aspect;
		const sentiment = comment.sentiment;

		const existingBar = barData.find(
			(item) => item.semester === semester && item.aspect === aspect
		);
		if (existingBar) {
			existingBar.value += 1;
		} else {
			barData.push({ semester, aspect, value: 1 });
		}

		if (!lineData[semester]) {
			lineData[semester] = { positive: 0, neutral: 0, negative: 0 };
		}
		lineData[semester][sentiment] += 1;
	});

	const lineChartData = Object.keys(lineData).flatMap((semester) => [
		{ semester, sentiment: "positive", value: lineData[semester].positive },
		{ semester, sentiment: "neutral", value: lineData[semester].neutral },
		{ semester, sentiment: "negative", value: lineData[semester].negative },
	]);

	return { barData, lineChartData };
};
