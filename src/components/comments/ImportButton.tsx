"use client";

import { useFilter } from "@/contexts/FilterContext";
import useNavigate from "@/hooks/useNavigate";
import { Button, Card, Input, Spinner } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ImportButton({ handleClick }: { handleClick: () => void }) {
	const { setKeyword } = useFilter();

	const searchParams = useSearchParams();

	const [searchText, setSearchText] = useState(searchParams.get("keyword") || "");

	const keyword = searchParams.get("keyword") || "";
	useEffect(() => {
		setSearchText(keyword);
	}, [keyword]);

	return (
		<div className="flex flex-row items-center mt-12 gap-5">
			<Button
				onClick={handleClick}
				onPress={() => {
					if (searchText == "") return;
					setKeyword(searchText);
				}}
				className=""
				variant="shadow"
				color="primary"
				size="md"
			>
				<p className=" font-medium">Nhập dữ liệu</p>
			</Button>
		</div>
	);
}
