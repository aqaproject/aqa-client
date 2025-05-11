"use client";

import BreadCrumb from "@/components/BreadCrumb";
import PageTabs from "@/components/PageTabs";
import { useIsLecturer } from "@/hooks/useIsAdmin";
import useLecturerInfo from "@/hooks/useLecturerInfo";
import { ReactNode } from "react";

export default function Layout({
	params: { lecturer_id },
	children,
}: {
	params: { lecturer_id: string };
	children: ReactNode;
}) {
	const { lecturer } = useLecturerInfo(lecturer_id);

	const { isLecturer } = useIsLecturer();

	return (
		<div>
			<h1 className="font-extrabold text-2xl">{lecturer.display_name}</h1>
			{isLecturer ? null : <BreadCrumb />}
			<PageTabs
				lastIndex={3}
				defaultPath={`lecturer/${lecturer_id}`}
				tabs={tabs}
			/>
			<div className="mt-4"> {children}</div>
		</div>
	);
}

const tabs = [
	{
		link: "",
		title: "Trang chủ",
	},
	{
		link: "classes",
		title: "Tất cả các lớp",
	},
	{
		link: "semesters",
		title: "Điểm trung bình qua các học kỳ",
	},
	{
		link: "comments",
		title: "Ý kiến",
	},
];
