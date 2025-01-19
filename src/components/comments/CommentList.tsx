import React from "react";
import { Comment } from "./interfaces/IComment";

interface CommentListProps {
	data: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ data = [] }) => {
	return (
		<div>
			{data.length > 0 ? (
				data.map((comment) => (
					<div key={comment.comment_id} style={{ marginBottom: "20px" }}>
						<p>
							<strong>{comment.aspect}</strong>: {comment.display_name}
						</p>
						<p>
							<strong>Loại:</strong>{" "}
							{comment.sentiment === "positive"
								? "Tích cực"
								: comment.sentiment === "negative"
								? "Tiêu cực"
								: "Trung tính"}
						</p>
					</div>
				))
			) : (
				<p>Không có bình luận nào.</p>
			)}
		</div>
	);
};

export default CommentList;
