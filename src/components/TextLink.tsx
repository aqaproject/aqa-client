"use client";

import { useFilterUrlQuery } from "@/hooks/useFilterUrlQuery";
import { ReactNode } from "react";

export default function TextLink({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) {
	const { setUrlQuery } = useFilterUrlQuery();
	return (
		<div onClick={() => setUrlQuery(href, {})} className=" inline-block">
			<span className=" underline font-semibold cursor-pointer hover:text-sky-600 hover:dark:text-sky-500">
				{children}
			</span>
		</div>
	);
}
