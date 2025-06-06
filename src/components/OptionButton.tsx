"use client";

import { ReactNode } from "react";
import { Button, ButtonProps, Tooltip } from "@heroui/react";
import { ButtonVariantProps } from "@heroui/react";

type Props = {
	children?: ReactNode;
	className?: React.ComponentProps<"button">["className"];
	onPress?: (e: any) => any;
	hasValue?: boolean;
	tooltip?: ReactNode;
	isNoBorder?: boolean;
};

export default function OptionButton({
	children,
	className,
	onPress,
	hasValue = false,
	tooltip,
	isNoBorder = false,
	...props
}: Props & ButtonProps) {
	return (
		<Tooltip
			isDisabled={!Boolean(tooltip)}
			content={<p className=" max-w-md h-auto">{tooltip}</p>}
		>
			<Button
				onPress={onPress}
				variant={hasValue ? "shadow" : "ghost"}
				color={hasValue ? "primary" : "default"}
				className={`${
					hasValue
						? " font-medium"
						: isNoBorder
						? " bg-white dark:bg-zinc-800 border-0 dark:hover:!bg-zinc-700 hover:!bg-zinc-100"
						: " border-0 text-secondary-foreground bg-secondary-normal hover:!bg-secondary-hover"
				} rounded-lg shadow-sm`}
				{...props}
			>
				{children}
			</Button>
		</Tooltip>
	);
}
