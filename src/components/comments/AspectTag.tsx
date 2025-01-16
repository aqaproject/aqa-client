"use client";

import { useFilter } from "@/contexts/FilterContext";
import useNavigate from "@/hooks/useNavigate";
import { Button, Card, Input, Spinner } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function AspectTag({
	isLoading,
	childrenName,
	onClick,
}: {
	isLoading: boolean;
	childrenName: string;
	onClick: () => void;
}) {
	// {}: { childrenName: string }
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
				onClick={onClick}
				onPress={() => {
					if (searchText == "" || isLoading) return;
					setKeyword(searchText);
				}}
				disabled={isLoading}
				className=""
				variant="shadow"
				color="gray"
				size="md"
			>
				{isLoading ? (
					<Spinner color="default" size={"sm"} />
				) : (
					<p className=" font-medium">{childrenName}</p>
				)}
			</Button>
		</div>
	);
}
