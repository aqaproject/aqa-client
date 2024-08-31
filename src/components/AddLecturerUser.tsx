"use client";

import { ROLE_DESCRIPTION_ENUM, ROLE_ENUM } from "@/constants/role";
import {
	Lecturer,
	Role,
	useAllLecturersQuery,
	useAllLecturersSuspenseQuery,
	useRegisterUserMutation,
} from "@/gql/graphql";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
	Select,
	SelectItem,
	Table,
	getKeyValue,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import FacultySelector from "./selectors/FacultySelector";
import { FilterProvider, useFilter } from "@/contexts/FilterContext";
import LecturerSelector from "./LecturerSelector";

const columns = [
	{
		key: "index",
		label: "STT",
	},
	{
		key: "display_name",
		label: "Tên giảng viên",
	},
];

type Props = {
	refetch?: () => any;
};

export default function AddLecturerUser() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const { data } = useAllLecturersQuery({
		variables: { filter: {}, sort: {} },
	});

	const [mutate] = useRegisterUserMutation();

	const handleAddUser = useCallback(
		async (lecturer: Lecturer) => {
			try {
				if (!lecturer.email) return;
				const password = "";
				const promise = mutate({
					variables: {
						user: {
							displayName: lecturer.display_name,
							username: lecturer.email,
							lecturerId: lecturer?.lecturer_id,
							role: Role.Lecturer,
							password,
						},
					},
				});
				await toast.promise(promise, {
					loading: "Đang tạo tài khoản...",
					success: "Tạo tài khoản thành công",
					error: "Tên đăng nhập đã tồn tại",
				});
			} catch (error) {}
		},
		[mutate]
	);

	return (
		<div>
			<Button onClick={onOpen} variant={"flat"}>
				<p className=" font-semibold">Thêm tài khoản giảng viên</p>
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<div>
							<Table
								aria-label="Selection behavior table example with dynamic content"
								selectionMode="multiple"
								selectionBehavior={"toggle"}
							>
								<TableHeader columns={columns}>
									{(column) => (
										<TableColumn key={column.key}>
											{column.label}
										</TableColumn>
									)}
								</TableHeader>
								<TableBody
									items={(data?.lecturers.data || []).map(
										(value, index) => ({
											index,
											display_name: value.display_name,
										})
									)}
								>
									{(item) => (
										<TableRow key={item.display_name}>
											{(columnKey) => (
												<TableCell>
													{getKeyValue(item, columnKey)}
												</TableCell>
											)}
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
