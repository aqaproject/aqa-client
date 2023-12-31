"use client";

import { getSemesterList } from "@/api/semester";
import { useFilter } from "@/contexts/FilterContext";
import { Button } from "@nextui-org/button";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function SemesterSelector() {
	const { semester, setSemester } = useFilter();
	const [semesters, setSemesters] = useState<Semester[]>([]);

	useEffect(() => {
		(async () => {
			const semesterList = await getSemesterList();
			setSemesters(semesterList);
		})();
	}, []);

	return (
		<Dropdown backdrop="blur" shouldBlockScroll={false}>
			<DropdownTrigger>
				<Button variant="bordered" className="w-fit">
					<p className="font-medium w-fit">
						{semester?.semester_name || "Tất cả học kỳ"}
					</p>
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				variant="faded"
				aria-label="Semester dropwdown"
				selectionMode="single"
				selectedKeys={new Set([semester?.semester_id || ""])}
				onAction={(key) => {
					if (key === "all")
						setSemester?.({
							semester_name: "Tất cả học kỳ",
							semester_id: "all",
						});
					else setSemester(semesters.find((v) => v.semester_id === key));
				}}
			>
				<DropdownSection title="Chọn học kỳ">
					{semesters.map(({ semester_name, semester_id }) => (
						<DropdownItem className={`py-2`} key={semester_id}>
							<p className="font-medium"> {semester_name}</p>
						</DropdownItem>
					))}
				</DropdownSection>
				<DropdownSection title={"Khác"}>
					<DropdownItem className={`py-2`} key={""}>
						<p className="font-medium">Tất cả</p>
					</DropdownItem>
				</DropdownSection>
			</DropdownMenu>
		</Dropdown>
	);
}
