import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function UICard({
	children,
	className,
	...props
}: { children: ReactNode } & React.ComponentPropsWithoutRef<"div">) {
	return (
		<div className={twMerge("bg-card rounded-2xl", className)} {...props}>
			{children}
		</div>
	);
}
