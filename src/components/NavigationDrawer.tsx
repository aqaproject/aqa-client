"use client";

import { Button, Card, CardBody } from "@heroui/react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	FunctionComponent,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

import usePersistentState from "@/hooks/usePersistentState";
import NAV_ICON from "@assets/nav.svg";
import { IoLogInOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import ThemeSwitcher from "./ThemeSwitcher";
import { UICard } from "./UICard";

export default function NavigationDrawer({ children }: { children?: ReactNode }) {
	const [open, setOpen] = usePersistentState("nav-open", false);

	const toggleDrawer = useCallback(() => {
		setOpen((prev) => !prev);
	}, [setOpen]);

	return (
		<NavigationDrawerContext.Provider value={{ isOpen: open }}>
			<nav className="group w-fit group px-5 pt-12 flex flex-col shadow-none transition-all hover:shadow-2xl">
				<div className="flex flex-row items-center">
					<Button className="ml-1" isIconOnly onPress={toggleDrawer}>
						<Image
							src={NAV_ICON}
							width={20}
							height={20}
							alt="Nav icon"
						/>
					</Button>
					{/* <div
						className={`relative h-5 ${
							open ? "opacity-100" : "opacity-0 invisible"
						} transition-all`}
					>
						<div className=" absolute -right-48">
							<ThemeSwitcher />
						</div>
					</div> */}
				</div>
				<div
					className={`-mt-20 h-full flex flex-col gap-4 ${
						open ? "justify-center" : "justify-center"
					}`}
				>
					{children}
				</div>
				<NavItem
					className=" mb-10"
					title="Đăng xuất"
					link="/sign-out"
					icon={IoLogInOutline}
				/>
			</nav>
		</NavigationDrawerContext.Provider>
	);
}

export function NavItem({
	title,
	link,
	icon: Icon,
	subItems,
	className,
}: INavItemProps) {
	const pathname = usePathname();
	const router = useRouter();

	const { isOpen } = useContext(NavigationDrawerContext);
	const [isHover, setIsHover] = useState(false);

	const subRef = useRef<HTMLUListElement>(null);

	const isSelected = pathname.split("/")[1] === link.split("/")[1];

	useEffect(() => {
		router.prefetch(link);
	}, [link, router]);

	return (
		<UICard
			className={twMerge(
				"group/nav h-fit w-fit hover:scale-105 transition-all",
				isSelected ? " bg-transparent" : "",
				className
			)}
			onMouseOver={() => setIsHover(true)}
			onMouseLeave={() => setTimeout(() => setIsHover(false), 0)}
		>
			<Card
				isPressable
				onPress={() => router.push(link)}
				className={`h-fit transition-all bg-transparent shadow-sm ${
					isOpen ? "shadow-none" : ""
				} ${isSelected ? " !bg-navbar-selected" : ""}`}
				style={isSelected ? { color: "white" } : {}}
			>
				<CardBody className="flex flex-col h-fit p-4">
					<div className={` flex flex-row items-start transition-all`}>
						<div className="w-[24px] grid place-items-center">
							{Icon ? (
								<Icon
									color={
										pathname.split("/")[1] === link.split("/")[1]
											? "white"
											: ""
									}
									width={24}
									size={24}
								/>
							) : null}
						</div>
						<div
							className={`${
								isOpen ? " ml-2 w-48" : "w-0"
							} h-6 relative overflow-hidden transition-all`}
						>
							<p className="whitespace-nowrap font-semibold text-base h-fit w-fit absolute top-0 left-3 transition-all duration-100`">
								{title}
							</p>
						</div>
					</div>
				</CardBody>
			</Card>
			{subItems ? (
				<div
					className={`  pl-3 ${
						isOpen ? "" : "w-0"
					} overflow-hidden transition-all`}
					style={{
						height:
							isOpen && isHover && subRef?.current
								? subRef.current.getBoundingClientRect().height
								: 0,
					}}
				>
					<ul
						ref={subRef}
						className="pb-3 pl-3 mt-3 w-full list-none border-l-3 border-l-blue-800"
					>
						{subItems?.map(({ title, link }) => (
							<Link href={link} key={link}>
								<li
									className={` my-1 rounded-xl p-2 ${
										pathname === link ? "" : "hover:bg-primary-hover"
									} cursor-pointer transition-all ${
										pathname === link
											? " bg-primary-normal text-black hover:text-black "
											: ""
									}`}
								>
									<p className=" font-semibold text-sm">
										{" "}
										{title}
									</p>
								</li>
							</Link>
						))}
					</ul>
				</div>
			) : null}
		</UICard>
	);
}

const NavigationDrawerContext = createContext({ isOpen: false });

export type INavigationDrawerContext = {
	isOpen: boolean;
};

export type INavItemProps = INavItem & {
	icon?: FunctionComponent<{ width?: number; size?: number; color: string }>;
	subItems?: INavItem[];
} & Pick<React.ComponentProps<"div">, "className">;

export type INavItem = {
	title: string;
	link: string;
};
