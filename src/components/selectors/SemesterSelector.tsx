"use client";

import SemesterIcon from "@/assets/SemesterIcon";
import { useFilter } from "@/contexts/FilterContext";
import { Semester, useSemestersQuery } from "@/gql/graphql";
import useNavigate from "@/hooks/useNavigate";
import { useRememberValue } from "@/hooks/useRememberValue";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Spinner,
} from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { SelectorButton } from "./SelectorButton";

type FilterType = {
	lecturer_id?: string;
};

function SemesterSelector_({
	semester,
	setSemester,
	semesters,
	isNoBorder = false,
}: {
	semester?: Semester;
	setSemester: (d?: Semester) => any;
	semesters: Semester[];
} & SemesterPropType) {
	const hasValue = Boolean(semester?.display_name);
	const buttonText = semester?.display_name || "Tất cả học kỳ";

	return (
		<Dropdown backdrop="blur" shouldBlockScroll={false}>
			<DropdownTrigger>
				<SelectorButton
					hasValue={hasValue}
					isNoBorder={isNoBorder}
					buttonText={buttonText}
					startContent={
						<SemesterIcon
							color={hasValue ? "black" : "oklch(55.4% 0.046 257.417)"}
							width={20}
						/>
					}
				/>
			</DropdownTrigger>
			<DropdownMenu
				variant="faded"
				aria-label="Semester dropwdown"
				className=" max-h-96 overflow-auto"
				selectionMode="single"
				selectedKeys={new Set([semester?.semester_id || ""])}
				onAction={(key) => {
					if (key === "") {
						setSemester?.({
							display_name: "Tất cả học kỳ",
							semester_id: "",
						});
					} else setSemester(semesters.find((v) => v.semester_id === key));
				}}
			>
				<DropdownSection title="Chọn học kỳ">
					{semesters.map(({ display_name, semester_id }) => (
						<DropdownItem className={`py-2`} key={semester_id}>
							<p className="font-medium"> {display_name}</p>
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

export default function SemesterSelector({
	lecturer_id,
	...props
}: SemesterPropType & FilterType) {
	const { semester, setSemester } = useFilter();
	const { data } = useSemestersQuery();

	return (
		<SemesterSelector_
			semester={semester}
			setSemester={setSemester}
			semesters={data?.semesters || []}
			{...props}
		/>
	);
}

export function SemesterSelectorWithSearchParam({
	lecturer_id,
	...props
}: SemesterPropType & FilterType) {
	const searchParams = useSearchParams();
	const navigate = useNavigate();

	const semesterId = searchParams.get("semester");

	const { data: semesters } = useSemestersQuery();
	const data = useRememberValue(semesters);

	const semester = useMemo<Semester | undefined>(() => {
		const semesterList = data?.semesters;
		if (semesterList?.length || 0 > 0) {
			if (semesterId)
				return semesterList?.find((v) => v.semester_id == semesterId);
		}
	}, [data?.semesters, semesterId]);
	// const semester = useRememberValue(semester_);

	const setSemester = useCallback(
		(semester: Semester | undefined) => {
			if (semester)
				navigate.replace({ semester: semester?.semester_id || "" });
		},
		[navigate]
	);

	return (
		<SemesterSelector_
			semester={semester}
			setSemester={setSemester}
			semesters={data?.semesters || []}
			{...props}
		/>
	);
}

type SemesterPropType = {
	isNoBorder?: boolean;
};
