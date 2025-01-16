"use client";

import { SemesterSelectorWithSearchParam } from "@/components/selectors/SemesterSelector";

import CommentQuantityInfo from "@/components/comments/CommentQuantityInfo";
import CommentSearchBar from "@/components/comments/CommentSearchBar";
import { FacultySelectorWithSearchParams } from "@/components/selectors/FacultySelector";
import { ProgramSelectorWithSearchParam } from "@/components/selectors/ProgramSelector";
import { SingleSubjectSelectorWithSearchParam } from "@/components/selectors/SingleSubjectSelector";
import { FilterArgs, useCommentListLazyQuery } from "@/gql/graphql";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Card } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import Loading from "../Loading";
import CommentItem from "./CommentItem";
import { useRememberValue } from "@/hooks/useRememberValue";
import ImportButton from "./ImportButton";
import AspectTag from "./AspectTag";
import { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

export default function CommentPage({ defaultFilter = {}, selectors = [] }: IProps) {
	const searchParams = useSearchParams();
	const query = {
		...defaultFilter,
		keyword: searchParams.get("keyword"),
		semester_id: selectors.includes("semester")
			? searchParams.get("semester")
			: undefined,
		program: selectors.includes("program")
			? searchParams.get("program")
			: undefined,
		faculty_id: selectors.includes("faculty")
			? searchParams.get("faculty")
			: undefined,
		subjects: selectors.includes("single-subject")
			? searchParams.get("subject_id")
				? [searchParams.get("subject_id")]
				: undefined
			: undefined,
		aspect: searchParams.get("aspect"),
	};

	const [getCommentList, { data, loading: isLoading }] = useCommentListLazyQuery({
		fetchPolicy: "cache-and-network",
	});
	const { dataList: comments, bottomRef } = useInfiniteScroll({
		queryFunction: getCommentList,
		variables: { filter: query, type: searchParams.get("type") },
		isLoading,
		data: data?.comments.data,
		meta: data?.comments.meta,
	});

	const metadata = useRememberValue(data?.comments.meta);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [file, setFile] = useState<File | null>(null);

	const handleOpenModal = () => setIsModalVisible(true);
	const handleCloseModal = () => setIsModalVisible(false);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
		}
	};

	const handleImportFile = async () => {
		if (!file) {
			alert("Vui lòng chọn một file để import.");
			return;
		}

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("http://localhost:4001/files/import", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Import failed");
			}

			alert("Import thành công!");
		} catch (error) {
			console.error("Error during import:", error);
			alert("Import thất bại, vui lòng thử lại.");
		} finally {
			handleCloseModal();
		}
	};
	return (
		<div>
			<div className="rounded-md flex flex-row overflow-hidden">
				<CommentQuantityInfo query={query} />
			</div>
			<div className="flex flex-col xl:flex-row gap-8 xl:gap-0 items-center ">
				<div className="flex flex-wrap gap-4 items-center">
					{selectors.includes("semester") && (
						<SemesterSelectorWithSearchParam />
					)}
					{selectors.includes("program") && (
						<ProgramSelectorWithSearchParam />
					)}
					{selectors.includes("faculty") && (
						<FacultySelectorWithSearchParams />
					)}
					{selectors.includes("single-subject") && (
						<SingleSubjectSelectorWithSearchParam
							defaultFilter={defaultFilter}
						/>
					)}
				</div>
			</div>
			<Modal open={isModalVisible} onClose={handleCloseModal}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						borderRadius: "16px",
						display: "flex",
						flexDirection: "column",
						gap: 3,
					}}
				>
					<Typography
						variant="h5"
						component="h2"
						textAlign="center"
						sx={{ fontWeight: "bold", marginBottom: 2 }}
					>
						Nhập file từ thiết bị
					</Typography>
					<input
						type="file"
						accept=".xlsx, .csv"
						onChange={handleFileChange}
						style={{
							padding: "8px",
							border: "1px solid #ccc",
							borderRadius: "8px",
							width: "100%",
						}}
					/>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: "16px",
						}}
					>
						<Button
							variant="contained"
							color="error"
							onClick={handleCloseModal}
							sx={{
								borderRadius: "10px",
								width: "48%",
							}}
						>
							Hủy
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={handleImportFile}
							sx={{
								borderRadius: "10px",
								width: "48%",
							}}
						>
							Tải lên
						</Button>
					</div>
				</Box>
			</Modal>
			<div className="flex flex-row gap-5">
				<CommentSearchBar isLoading={!data} />
				<ImportButton handleClick={handleOpenModal} />
			</div>

			<div className="flex flex-row gap-5">
				<AspectTag
					isLoading={!data}
					childrenName={"Tất cả"}
					onClick={() => {
						const params = new URLSearchParams(searchParams.toString());
						params.set("aspect", "null");
						window.location.search = params.toString();
					}}
				></AspectTag>
				<AspectTag
					isLoading={!data}
					childrenName={"Cơ sở vật chất"}
					onClick={() => {
						const params = new URLSearchParams(searchParams.toString());
						params.set("aspect", "FACILITY");
						window.location.search = params.toString();
					}}
				></AspectTag>
				<AspectTag
					isLoading={!data}
					childrenName={"Giảng viên"}
					onClick={() => {
						const params = new URLSearchParams(searchParams.toString());
						params.set("aspect", "PROFESSIONALISM");
						window.location.search = params.toString();
					}}
				></AspectTag>
				<AspectTag
					isLoading={!data}
					childrenName={"Tài liệu học tập"}
					onClick={() => {
						const params = new URLSearchParams(searchParams.toString());
						params.set("aspect", "MATERIAL");
						window.location.search = params.toString();
					}}
				></AspectTag>

				<AspectTag
					isLoading={!data}
					childrenName={"Khác"}
					onClick={() => {
						const params = new URLSearchParams(searchParams.toString());
						params.set("aspect", "OTHERS");
						window.location.search = params.toString();
					}}
				></AspectTag>
			</div>
			<Card className="mt-8 mb-20 w-full p-5">
				{comments.map(
					({ comment_id, content: content, type, class: class_ }) => (
						<CommentItem
							key={comment_id}
							content={content}
							type={type}
							comment_id={comment_id}
							class_id={class_?.class_id}
							isLast={false}
							classData={class_}
						/>
					)
				)}
				{metadata?.hasNext ? <Loading /> : null}
				{!metadata?.hasNext && !isLoading ? (
					<div className="w-full flex flex-col pt-6 pb-4 items-center">
						<p className="w-fit text-lg font-semibold">
							Không còn bình luận nào
						</p>
					</div>
				) : null}
				<div ref={bottomRef} key={"bottom-comment"} />
			</Card>
		</div>
	);
}

interface IProps {
	defaultFilter?: FilterArgs;
	selectors?: SelectorType[];
}
