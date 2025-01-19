export interface Comment {
	semester: {
		semester_id: number;
		display_name: string;
		type: string;
		year: string;
	};
	class: {
		class_id: number;
		display_name: string;
		semester_id: number;
		program: string;
		class_type: string;
		subject_id: number;
		lecturer_id: number;
		total_student: number;
		participating_student: number;
	};
	aspect: string;
	sentiment: "positive" | "negative" | "neutral";
	display_name: string;
	comment_id: number;
}
