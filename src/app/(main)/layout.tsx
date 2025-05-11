"use client";

import LecturerNavIcon from "@/assets/LecturerNavIcon";
import NavigationDrawer, { NavItem } from "@/components/NavigationDrawer";
import { useProfileQuery } from "@/gql/graphql";
import { useIsAdmin, useIsFullAccess, useIsLecturer } from "@/hooks/useIsAdmin";
import { useIsFaculty } from "@/hooks/useIsFaculty";
import CommentIcon from "@assets/CommentIcon";
import CriteriaIcon from "@assets/CriteriaIcon";
import HomeIcon from "@assets/HomeIcon";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const { data, loading } = useProfileQuery({ fetchPolicy: "network-only" });
	const { isFullAcess } = useIsFullAccess();
	const { isAdmin } = useIsAdmin();
	const { isFaculty } = useIsFaculty();
	const { isLecturer } = useIsLecturer();

	useEffect(() => {
		if (loading === false && !data) {
			router.replace("/signin");
		}
	}, [data, loading, router]);

	return (
		<>
			<NavigationDrawer>
				<NavItem title="Trang chủ" link="/" icon={HomeIcon} />
				<NavItem
					title="Ý kiến"
					link="/comment"
					icon={CommentIcon}
					subItems={[
						{
							title: "Tất cả",
							link: "/comment",
						},
						{
							title: "Tích cực",
							link: "/comment?type=positive",
						},
						{
							title: "Tiêu cực",
							link: "/comment?type=negative",
						},
					]}
				/>
				{isFullAcess || isFaculty ? (
					<NavItem
						title="Tra cứu dữ liệu"
						link="/criteria"
						icon={CriteriaIcon}
					/>
				) : isLecturer ? (
					<NavItem
						title="Tra cứu dữ liệu"
						link={`/lecturer/${data?.profile.lecturer?.lecturer_id}`}
						icon={CriteriaIcon}
					/>
				) : null}
				{isAdmin ? (
					<NavItem
						title="Quản lý tài khoản"
						link="/user"
						icon={LecturerNavIcon}
					/>
				) : null}
			</NavigationDrawer>
			<main className="w-full xl:px-20 lg:px-16 px-5 pt-12 pb-10 overflow-y-scroll overflow-x-hidden">
				<Suspense fallback={<p>Loading</p>}>{children}</Suspense>
			</main>
		</>
	);
}
