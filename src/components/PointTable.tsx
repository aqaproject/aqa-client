"use client";

import { GroupedPoint } from "@/gql/graphql";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	getKeyValue,
} from "@heroui/react";

interface IProps {
	data: GroupedPoint[];
}

export default function PointTable({ data }: IProps) {
	return (
		<Table
			isStriped
			color="default"
			selectionMode="single"
			aria-label="Point table"
			className=" bg-background rounded-2xl shadow-xl"
		>
			<TableHeader>
				<TableColumn>STT</TableColumn>
				<TableColumn key="criteria_name">Tiêu chí</TableColumn>
				<TableColumn key="point">Điểm</TableColumn>
			</TableHeader>
			<TableBody items={data}>
				{data.map((point, index) => (
					<TableRow key={point.id}>
						<TableCell>{index + 1}</TableCell>
						<TableCell>{point.display_name}</TableCell>
						<TableCell>{(point.average_point * 4).toFixed(1)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
