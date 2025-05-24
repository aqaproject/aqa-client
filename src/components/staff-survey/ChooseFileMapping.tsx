"use client";

import { Select, SelectItem } from "@heroui/react";
import { Key, useEffect, useState } from "react";

export type MappingItem = {
	name: string;
	column?: string;
	selected?: string;
	options?: string[];
	optionTitle?: string;
};

type PropTypes = {
	columns: string[];
	setMapping: (mappings: MappingItem[]) => void;
} & Pick<React.ComponentPropsWithoutRef<"div">, "className">;

const defaultColumns = [
	{
		label: "Nội dung cần cải thiện thêm",
		name: "additional_comment",
		column: "Quý Thầy/Cô muốn Nhà trường cải thiện các nội dung:",
	},
	{
		label: "Học vị",
		name: "academic_degree",
		column: "attribute_5",
	},
	{
		label: "Khoa/Bộ môn",
		name: "faculty",
		column: "attribute_6",
	},
	{
		label: "Học kỳ",
		name: "semester",
		selected: "2025",
		options: ["2020", "2021", "2022", "2023", "2024", "2025"],
		optionTitle: "Chọn học kỳ",
	},
];

export default function ChooseFileMapping({
	columns,
	setMapping,
	className,
}: PropTypes) {
	const [mapping, setMappingState] =
		useState<(MappingItem & { label: string })[]>(defaultColumns);

	useEffect(() => {
		setMapping(mapping);
	}, [mapping, setMapping]);

	return (
		<div className={className}>
			{mapping.map((item) => (
				<ColumnSelect
					key={item.label}
					columns={item.column ? columns : item.options || []}
					title={item.optionTitle}
					label={item.label}
					value={item.column ?? item.selected}
					onChange={(value) => {
						setMappingState((prev: any) => {
							const newMapping = [...prev];
							const index = newMapping.findIndex(
								(m) => m.name === item.label
							);
							if (index !== -1) {
								newMapping[index].column = value;
							} else {
								newMapping.push({
									name: item.label,
									column: value,
								});
							}
							return newMapping;
						});
					}}
				/>
			))}
		</div>
	);
}

function ColumnSelect({
	columns,
	label,
	value,
	onChange,
	title = "Chọn cột dữ liệu",
}: {
	columns: string[];
	label: string;
	value?: string;
	onChange?: (value: string) => void;
	title?: string;
}) {
	return (
		<div className="flex items-center gap-4">
			<label className="w-1/3">{label}</label>
			<Select
				className="max-w-[600px]"
				label={title}
				selectedKeys={[value as Key]}
				onChange={(e) => onChange?.(e.target.value)}
			>
				{columns?.map((column) => (
					<SelectItem key={column}>{column}</SelectItem>
				))}
			</Select>
		</div>
	);
}
