"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import COPY_ICON from "@assets/copy.svg";
import Image from "next/image";
import {
	Button,
	Card,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownSection,
	DropdownItem,
	Chip,
} from "@heroui/react";
import { Class } from "@/gql/graphql";
import { DeepPartial } from "@apollo/client/utilities";
import CommentModalItem from "./CommentModalItem";
import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { IoCopyOutline, IoEllipsisVertical } from "react-icons/io5";

export default function CommentItem({
	content,
	type,
	classData,
}: {
	content: string;
	type: string;
	comment_id: string;
	class_id?: string;
	isLast: boolean;
	classData?: DeepPartial<Class> | null;
}) {
	const { setUrlQuery } = useFilterUrlQuery();
	const [isOpen, setIsOpen] = useState(false);

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{
					ease: "easeOut",
					duration: 0.6,
				}}
				className="w-full py-3 flex items-center gap-4 border-b-1 border-b-slate-400"
			>
				<div
					className={` flex h-16 w-2 rounded-md ${
						type === "positive" ? "bg-green-300" : "bg-red-300"
					}`}
				></div>
				<div className=" mr-auto w-full flex flex-col gap-2">
					<p className="font-medium text-sm text-left whitespace-pre-wrap	">
						{content}
					</p>
					<Chip
						size="sm"
						className={`w-24 ${
							type === "positive"
								? "bg-green-300 dark:bg-green-700"
								: "bg-red-300 dark:bg-red-700"
						}`}
					>
						<p className=" px-1 py-1 capitalize font-medium text-xs">
							{type == "positive" ? "Tích cực" : "Tiêu cực"}
						</p>
					</Chip>
				</div>
				<Button
					isIconOnly
					aria-label="Like"
					variant="flat"
					onPress={() => copyToClipboard(content)}
				>
					<IoCopyOutline />
				</Button>
				<Button
					isIconOnly
					aria-label="Like"
					variant="flat"
					onPress={() => setIsOpen(true)}
				>
					<IoEllipsisVertical />
				</Button>
			</motion.div>
			<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Thông tin chi tiết về ý kiến
							</ModalHeader>
							<ModalBody>
								<div className=" flex flex-col gap-4">
									<CommentModalItem
										title="Học kỳ"
										value={classData?.semester?.display_name}
									/>
									<CommentModalItem
										title="Khoa/Bộ môn"
										value={
											classData?.subject?.faculty?.display_name
										}
										onClick={() => {
											setUrlQuery(
												`/faculty/${classData?.subject?.faculty?.faculty_id}`
											);
										}}
									/>
									<CommentModalItem
										title="Môn học"
										value={classData?.subject?.display_name}
										onClick={() => {
											setUrlQuery(
												`/subject/${classData?.subject?.display_name}`
											);
										}}
									/>
									<CommentModalItem
										title="Lớp"
										value={classData?.display_name}
										onClick={() => {
											setUrlQuery(
												`/class/${classData?.class_id}`
											);
										}}
									/>
									<CommentModalItem
										title="Giảng viên"
										value={classData?.lecturer?.display_name}
										onClick={() => {
											setUrlQuery(
												`/lecturer/${classData?.lecturer?.lecturer_id}`
											);
										}}
									/>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									variant="light"
									onPress={onClose}
								>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
