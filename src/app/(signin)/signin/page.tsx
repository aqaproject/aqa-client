"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { useLoginMutation, useProfileQuery } from "@/gql/graphql";
import { useAuth } from "@/stores/auth.store";

export default function Page() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [login] = useLoginMutation({
		onError(error, clientOptions) {
			toast.error(
				<div className=" flex flex-col gap-2">
					<p className=" text-sm font-medium text-foreground-700">
						Lỗi đăng nhập
					</p>
					<p className=" font-semibold text-foreground-900">
						Tên đăng nhập hoặc mật khẩu không đúng
					</p>
				</div>
			);
		},
	});
	const { authData, isLogin, authLogin } = useAuth();
	const { data, loading } = useProfileQuery({ fetchPolicy: "network-only" });

	const handleSignIn = useCallback(async () => {
		const res = await login({ variables: { username, password } });
		if (res.data?.login) {
			authLogin(res.data.login);
			router.push("/");
		}
	}, [login, username, password, authLogin, router]);

	useEffect(() => {
		if (loading === false && data) {
			router.replace("/");
		}
	}, [data, loading, router]);

	return (
		<div className="flex h-screen w-full">
			<div className="w-2/3 h-full relative overflow-hidden">
				<Image
					src="https://assets.isu.pub/document-structure/230127072523-431714e764cebb42fd8c475555e65eba/v1/efcf20b81b132459315df78e828ef26a.jpeg"
					alt="Background trường học"
					fill
					style={{ objectFit: "cover" }}
					priority
				/>
			</div>

			<div className="w-1/3 flex items-center justify-center bg-white">
				<div className="w-full max-w-md px-8 flex flex-col items-center">
					<Image
						src="https://www.uit.edu.vn/sites/vi/files/banner_uit.png"
						alt="Logo trường UIT"
						width={600}
						height={200}
						className="mb-6"
					/>
					<h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
						Website Feedback Analysis
					</h1>
					<form
						className="w-full space-y-6"
						onSubmit={(e) => {
							e.preventDefault();
							handleSignIn();
						}}
					>
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700"
							>
								Tên đăng nhập
							</label>
							<input
								type="text"
								id="username"
								placeholder="Nhập mã cán bộ"
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Mật khẩu
							</label>
							<input
								type="password"
								id="password"
								placeholder="Nhập mật khẩu"
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
						>
							Đăng nhập
						</button>
					</form>
					<div className="mt-4 text-center text-sm">
						<a
							href="https://auth.uit.edu.vn/"
							className="text-blue-600 hover:underline"
						>
							Quên mật khẩu?
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
