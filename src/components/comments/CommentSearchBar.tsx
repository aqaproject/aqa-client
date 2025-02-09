"use client";

import { Button, Card, Input, Spinner } from "@nextui-org/react";
import { useState } from "react";

export default function CommentSearchBar({
	isLoading,
	onSearch,
}: {
	isLoading: boolean;
	onSearch: (keyword: string) => void;
}) {
	const [searchText, setSearchText] = useState("");

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && searchText.trim() !== "") {
			onSearch(searchText);
		}
	};

	const handleSearch = () => {
		if (searchText.trim() !== "") {
			onSearch(searchText);
		}
	};

	return (
		<div className="flex flex-row items-center mt-12 gap-5">
			<Card className="w-fit" shadow="md">
				<Input
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					onKeyDown={handleKeyDown}
					isClearable
					type="text"
					size="md"
					placeholder="Nhập từ khóa cần tìm..."
					variant="bordered"
					className="w-[500px]"
				/>
			</Card>
			<Button
				onPress={handleSearch}
				disabled={isLoading || searchText.trim() === ""}
				className=""
				variant="shadow"
				color="primary"
				size="md"
			>
				{isLoading ? (
					<Spinner color="default" size={"sm"} />
				) : (
					<p className="font-medium">Tìm kiếm</p>
				)}
			</Button>
		</div>
	);
}
