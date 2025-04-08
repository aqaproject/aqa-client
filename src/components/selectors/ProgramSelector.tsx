"use client";

import ProgramIcon from "@/assets/ProgramIcon";
import { useFilter } from "@/contexts/FilterContext";
import { useProgramsQuery } from "@/gql/graphql";
import useNavigate from "@/hooks/useNavigate";
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

function ProgramSelector_({
	program,
	setProgram,
	isNoBorder = false,
}: {
	program?: string;
	setProgram?: (d: string) => any;
} & ProgramSelectorPropTypes) {
	const { data, loading: isLoading } = useProgramsQuery();

	const hasValue = Boolean(program);
	const buttonText = program || "Chương trình";

	return (
		<Dropdown backdrop="blur" shouldBlockScroll={false}>
			<DropdownTrigger>
				<SelectorButton
					hasValue={hasValue}
					isNoBorder={isNoBorder}
					buttonText={buttonText}
					startContent={
						<ProgramIcon
							color={hasValue ? "black" : "oklch(55.4% 0.046 257.417)"}
							width={20}
						/>
					}
				/>
			</DropdownTrigger>
			<DropdownMenu
				variant="faded"
				aria-label="Program dropdown"
				selectionMode="single"
				selectedKeys={new Set([program || ""])}
				onAction={(key) => setProgram?.(key as string)}
			>
				<DropdownSection title="Chọn chương trình">
					{data && !isLoading ? (
						data.programs.map(({ program: programTitle }) => (
							<DropdownItem
								onPress={() => setProgram?.(programTitle)}
								className={`py-2`}
								key={programTitle}
							>
								<p className="font-medium"> {programTitle}</p>
							</DropdownItem>
						))
					) : (
						<div className=" flex flex-row gap-3">
							<Spinner size="sm" />
							<p className=" text-sm font-medium">Đang tải</p>
						</div>
					)}
				</DropdownSection>
				<DropdownSection title={"Khác"}>
					<DropdownItem
						onPress={() => setProgram?.("")}
						className={`py-2`}
						key={""}
					>
						<p className="font-medium">Tất cả</p>
					</DropdownItem>
				</DropdownSection>
			</DropdownMenu>
		</Dropdown>
	);
}

export default function ProgramSelector(props: ProgramSelectorPropTypes) {
	const { program, setProgram } = useFilter();

	return <ProgramSelector_ program={program} setProgram={setProgram} {...props} />;
}

export function ProgramSelectorWithSearchParam(props: ProgramSelectorPropTypes) {
	const searchParams = useSearchParams();
	const navigate = useNavigate();

	const program = useMemo(
		() => searchParams.get("program") || undefined,
		[searchParams]
	);

	const setProgram = useCallback(
		(program: string) => navigate.replace({ program }),
		[navigate]
	);

	return <ProgramSelector_ program={program} setProgram={setProgram} {...props} />;
}

type ProgramSelectorPropTypes = {
	isNoBorder?: boolean;
};
