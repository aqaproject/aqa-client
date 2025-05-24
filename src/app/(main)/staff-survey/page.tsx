import { Button } from "@heroui/react";
import Link from "next/link";
import {} from "react-icons";

export default function Page() {
	return (
		<div>
			<div className=" flex items-center justify-between mb-4">
				<h1 className=" text-2xl font-bold">Dữ liệu khảo sát giảng viên</h1>
				<div className="flex gap-4">
					<Link href="/staff-survey/add">
						<Button color="primary">
							<p className=" font-semibold">Thêm dữ liệu mới</p>
						</Button>
					</Link>
					<Link href="/staff-survey/upload">
						<Button>
							<p className=" font-semibold">Tải dữ liệu lên</p>
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
