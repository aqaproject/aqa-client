"use client";

import CommentChart from "@/components/comments/CommentChart";
import CommentList from "@/components/comments/CommentList";
import CommentSearchBar from "@/components/comments/CommentSearchBar";
import ImportButton from "@/components/comments/ImportButton";
import { FacultySelectorWithSearchParams } from "@/components/selectors/FacultySelector";
import { ProgramSelectorWithSearchParam } from "@/components/selectors/ProgramSelector";
import { SemesterSelectorWithSearchParam } from "@/components/selectors/SemesterSelector";
import { SingleSubjectSelectorWithSearchParam } from "@/components/selectors/SingleSubjectSelector";
import { Button, Modal, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

import { ImportModal } from "./ImportModal";

export default function CommentPage({ defaultFilter = {}, selectors = [] }: IProps) {
	const [query, setQuery] = useState({
		...defaultFilter,
		keyword: "",
		semester_id: selectors.includes("semester") ? "" : undefined,
		program: selectors.includes("program") ? "" : undefined,
		faculty_id: selectors.includes("faculty") ? "" : undefined,
		subjects: selectors.includes("single-subject") ? [] : undefined,
	});

	const [isLoading, setIsLoading] = useState(false);
	const [comments, setComments] = useState([]);
	const [activeTab, setActiveTab] = useState(0);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [file, setFile] = useState<File | null>(null);

	const handleOpenModal = () => setIsModalVisible(true);
	const handleCloseModal = () => setIsModalVisible(false);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
		}
	};
	// Fetch comments data
	const fetchComments = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`http://localhost:4001/comments`);
			const data = await response.json();
			setComments(data.data || []);
		} catch (error) {
			console.error("Error fetching comments:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchComments();
	}, [query]);

	// Handle search
	const handleSearch = (keyword: string) => {
		setQuery((prev: QueryType) => ({
			...prev,
			keyword,
		}));
	};

	// Handle tab change
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	// Handle file import
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
			setIsModalVisible(false);
			fetchComments();
		} catch (error) {
			console.error("Error during import:", error);
			alert("Import thất bại, vui lòng thử lại.");
		} finally {
			handleCloseModal();
		}
	};
	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="flex flex-col xl:flex-row gap-8 xl:gap-0 items-center">
				{/* Filters */}
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
			<Modal
				open={isModalVisible}
				onClose={handleCloseModal}
				closeAfterTransition
			>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "white",
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
				<CommentSearchBar isLoading={isLoading} onSearch={handleSearch} />
				<ImportButton handleClick={handleOpenModal} />
			</div>
			{/* Modal nhập dữ liệu
			<ImportModal
				isVisible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				onImport={handleImportFile}
			/> */}
			{/* Tabs */}
			<Box sx={{ borderBottom: 1, borderColor: "divider", marginTop: "20px" }}>
				<Tabs
					value={activeTab}
					onChange={handleTabChange}
					aria-label="Comment tabs"
				>
					<Tab label="Biểu đồ" />
					<Tab label="Danh sách bình luận" />
				</Tabs>
			</Box>
			{/* Nội dung của từng tab */}
			{activeTab === 0 && (
				<div className="mt-4">
					<CommentChart response={{ data: comments }} />
				</div>
			)}
			{activeTab === 1 && (
				<div className="mt-4">
					<CommentList data={comments} />
				</div>
			)}
		</div>
	);
}

interface IProps {
	defaultFilter?: any;
	selectors?: string[];
}

interface QueryType {
	keyword?: string;
	semester_id?: number | null;
	aspect?: string;
}
