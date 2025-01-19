import React from "react";
import { Comment } from "./interfaces/IComment";
import CombinedBarLineChart from "./GroupedStackedBarChart";

const CommentChart = ({ response }: { response: { data: Comment[] } }) => {
	const data = response.data;

	return (
		<div>
			<h3>Biểu đồ bình luận</h3>
			<CombinedBarLineChart data={data} />
		</div>
	);
};

export default CommentChart;
