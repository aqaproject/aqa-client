"use client";

import SemesterContext from "@/contexts/SemesterContext";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@nextui-org/react";
import { Key, useContext } from "react";

export default function SemesterSelectorUI({
	semesters,
}: {
	semesters: Semester[];
}) {
	const { semester, setSemester } = useContext(SemesterContext);

	return (
		<Dropdown backdrop="blur">
			<DropdownTrigger>
				<Button variant="bordered">
					<p className="font-medium">
						{semester?.display_name || "Chọn học kỳ"}
					</p>
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				variant="faded"
				aria-label="Static Actions"
				selectionMode="single"
				selectedKeys={new Set([semester?.semester_id || ""])}
				onAction={(key) =>
					setSemester?.(semesters.find((v) => v.semester_id === key))
				}
			>
				<DropdownSection title="Chọn học kỳ">
					{semesters.map(({ display_name, semester_id }) => (
						<DropdownItem className={`py-2`} key={semester_id}>
							<p className="font-medium"> {display_name}</p>
						</DropdownItem>
					))}
				</DropdownSection>
			</DropdownMenu>
		</Dropdown>
	);
}