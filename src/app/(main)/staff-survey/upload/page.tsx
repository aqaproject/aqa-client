"use client";

import { Button, Checkbox } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import readXlsxFile from "read-excel-file";
import {} from "react-icons";
import { UICard } from "@/components/UICard";
import { set } from "lodash";

export default function Page() {
	const [file, setFile] = useState<File | null>(null);
	const [data, setData] = useState<any[]>([]);
	const [step, setStep] = useState(0);
	const [isReadingFile, setIsReadingFile] = useState(false);
	const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
	const [selectedStart, setSelectedStart] = useState<number>(0);
	const [selectedEnd, setSelectedEnd] = useState<number>(0);

	const fileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<div>
			<div className=" flex items-center justify-between mb-4">
				<h1 className=" text-2xl font-bold">
					Upload dữ liệu khảo sát giảng viên
				</h1>
			</div>
			<div className=" mt-8">
				<Button onPress={() => fileRef.current?.click()}>
					<p className=" font-semibold">
						{file ? file.name : "Chọn file cần upload"}
					</p>
				</Button>
				<input
					ref={fileRef}
					className=" hidden"
					type="file"
					multiple={false}
					onChange={async (e) => {
						const file = e.target.files?.[0];
						setIsReadingFile(true);
						if (file) {
							setFile(file);
							readXlsxFile(file).then((rows) => {
								setData(rows);
								setIsReadingFile(false);
							});
						}
					}}
					accept=".xlsx, .xls, .csv"
				/>
			</div>
			{file ? (
				<div className=" mt-5">
					{step === 0 ? (
						<div>
							<div>
								<h1 className=" text-xl font-semibold">
									Bước 1: Chọn các trường dữ liệu điểm đánh giá
								</h1>
								<p> Chọn các trường chứa điểm đánh giá</p>
							</div>
							<UICard className=" mt-4 px-6 py-4 max-h-[400px] overflow-y-auto">
								{data[0]?.map((column: string, index: number) => (
									<Checkbox
										className=" block"
										key={index}
										isSelected={
											(index >= selectedStart &&
												index <= selectedEnd) ||
											index === selectedStart
										}
										onChange={() => {
											if (
												selectedStart === 0 &&
												selectedEnd === 0
											) {
												setSelectedStart(index);
											} else if (
												selectedStart !== 0 &&
												selectedEnd === 0
											) {
												setSelectedEnd(index);
											}
										}}
									>
										{column}
									</Checkbox>
								))}
							</UICard>
						</div>
					) : step === 1 ? (
						<div>
							<div>
								<h1 className=" text-xl font-semibold">
									Bước 2: Chọn các trường dữ liệu thông tin giảng viên
								</h1>
								<p>Chọn các trường dữ liệu chứa thông tin giảng viên đang đánh giá</p>
							</div>
							<UICard className=" mt-4 px-6 py-4 max-h-[400px] overflow-y-auto">
								{data[0]?.map((column: string, index: number) => (
									<Checkbox
										className=" block"
										key={index}
										isSelected={
											(index >= selectedStart &&
												index <= selectedEnd) ||
											index === selectedStart
										}
										onChange={() => {
											if (
												selectedStart === 0 &&
												selectedEnd === 0
											) {
												setSelectedStart(index);
											} else if (
												selectedStart !== 0 &&
												selectedEnd === 0
											) {
												setSelectedEnd(index);
											}
										}}
									>
										{column}
									</Checkbox>
								))}
							</UICard>
						</div>
					) : null}
                    <div className=" mt-4 flex items-center justify-end">
                        <Button
                            className=" "
                            onPress={() => {
                                if (step === 0) {
                                    setStep(1);
                                } else if (step === 1) {
                                    setStep(2);
                                }
                            }}
                        >
                            Tiếp theo
                        </Button>
                    </div>
				</div>
			) : null}
		</div>
	);
}

const MAPPING_DATA = {
	basicInfo: [
		{
			field: "first_name",
			default: "Họ",
		},
		{
			field: "last_name",
			default: "Tên",
		},
		{},
	],
	point: {},
};
