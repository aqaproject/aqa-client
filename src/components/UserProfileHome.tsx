"use client";

import { useProfileQuery } from "@/gql/graphql";
import { useIsAdmin, useIsFullAccess, useIsLecturer } from "@/hooks/useIsAdmin";
import { useIsFaculty } from "@/hooks/useIsFaculty";
import { UICard } from "./UICard";

export default function UserProfileHome() {
	const { data, loading } = useProfileQuery({ fetchPolicy: "network-only" });
	const { isFullAcess } = useIsFullAccess();
	const { isAdmin } = useIsAdmin();
	const { isFaculty } = useIsFaculty();
	const { isLecturer } = useIsLecturer();

	return (
		<div className="flex flex-col gap-4 mt-2 mb-16 px-20">
			<div className=" my-16 flex flex-col gap-4 ">
				<h1 className=" w-full text-center text-3xl font-extrabold">
					Chào mừng bạn đến với hệ thống AQA!
				</h1>
				<h2 className=" w-full text-center text-base font-base">
					Hệ thống AQA cung cấp chức năng xem điểm đánh giá và ý kiến phản
					hồi của sinh viên đối với giảng viên, hỗ trợ cải thiện chất lượng
					giảng dạy
				</h2>
			</div>
			{isLecturer && (
				<UICard className="w-full p-5 mt-6 flex flex-col gap-2">
					<p className=" font-normal mb-1">Thông tin tài khoản:</p>
					<p className=" text-2xl font-extrabold flex gap-4 items-center">
						{data?.profile.lecturer?.display_name}
						<span className=" text-base font-normal">
							{" "}
							{data?.profile.lecturer?.email}
						</span>
					</p>
					<p className=" text-sm ">
						<span>MSCB: </span>
						<span className=" text-base font-semibold">
							{data?.profile.lecturer?.mscb}
						</span>
					</p>
				</UICard>
			)}
			{isFaculty && (
				<UICard className="w-full p-5 mt-6 flex flex-col gap-2">
					<p className=" font-normal mb-1">Thông tin tài khoản:</p>
					<p className=" text-2xl font-extrabold flex gap-2 items-center">
						Cán bộ quản lý khoa
						<span className=" underline underline-offset-4">
							{data?.profile.faculty?.display_name}
						</span>
					</p>
				</UICard>
			)}
			{isFullAcess && !isAdmin && (
				<UICard className="w-full p-5 mt-6 flex flex-col gap-2">
					<p className=" font-normal mb-1">Thông tin tài khoản:</p>
					<p className=" text-2xl font-extrabold flex gap-4 items-center">
						Cán bộ quản lý nhà trường
					</p>
				</UICard>
			)}
			{isAdmin && (
				<UICard className="w-full p-5 mt-6 flex flex-col gap-2">
					<p className=" font-normal mb-1">Thông tin tài khoản:</p>
					<p className=" text-2xl font-extrabold flex gap-4 items-center">
						Admin
					</p>
				</UICard>
			)}
		</div>
	);
}
