/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import getUpdatedData from "@/libs/getUpdatedData";

const AccountMenu = ({ user }: any) => {
	const [userData, setUserData] = useState(user);

	useEffect(() => {
		const fetchUserData = async () => {
			if (user?.email) {
				const data = await getUpdatedData(user.email);
				if (data) {
					setUserData(data);
				}
			}
		};

		fetchUserData();
	}, [user?.email]);

	const avatarUrl = `/api/avatar?name=${encodeURIComponent(userData?.name || '')}&size=32`;

	return (
		<>
			<div className='mb-2 flex items-center border-b border-stroke px-3 py-3 dark:border-stroke-dark'>
				<div className='relative mr-2.5 h-8 w-8 overflow-hidden rounded-full'>
					<div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full animate-pulse' />
					<div className='relative h-full w-full overflow-hidden rounded-full border-2 border-white dark:border-gray-700 shadow-lg'>
						<Image
							src={avatarUrl}
							alt={userData?.name || "profile"}
							fill
							className='object-cover'
							sizes="32px"
							unoptimized
							priority
						/>
					</div>
				</div>
				<div className="min-w-0">
					<p className='text-sm font-medium text-dark dark:text-white truncate'>
						{userData?.name || ''}
					</p>
					<p className='text-xs text-body dark:text-gray-5 truncate'>
						{userData?.email}
					</p>
					{userData?.websiteName && (
						<p className='text-xs text-primary dark:text-primary truncate'>
							{userData.websiteName}
						</p>
					)}
				</div>
			</div>

			<div className="max-h-[calc(100vh-200px)] overflow-y-auto">
				<ul className="space-y-1">
					<li className='mx-2 mb-1'>
						<Link
							href={userData?.role?.toLowerCase() === "admin" ? "/admin" : "/user"}
							className='flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-body hover:bg-gray-2 hover:text-dark dark:hover:bg-primary dark:hover:text-white'
						>
							<span className="w-4">
								<svg
									width='16'
									height='16'
									viewBox='0 0 16 16'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d="M6.66667 14H2.66667C2.31305 14 1.97391 13.8595 1.72386 13.6095C1.47381 13.3594 1.33333 13.0203 1.33333 12.6667V3.33333C1.33333 2.97971 1.47381 2.64057 1.72386 2.39052C1.97391 2.14048 2.31305 2 2.66667 2H6.66667M11.3333 11.3333L14.6667 8M14.6667 8L11.3333 4.66667M14.6667 8H6.66667"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<span className="truncate">Dashboard</span>
						</Link>
					</li>
					<li className='mx-2 mb-1'>
						<Link
							href="/user/settings"
							className='flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-body hover:bg-gray-2 hover:text-dark dark:hover:bg-primary dark:hover:text-white'
						>
							<span className="w-4">
								<svg
									width='16'
									height='16'
									viewBox='0 0 16 16'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M13.3333 8C13.3333 8.17685 13.3181 8.35074 13.2889 8.52074L14.8111 9.73407C14.9356 9.83741 14.9689 10.0141 14.8889 10.1541L13.5556 12.5126C13.4756 12.6526 13.3111 12.7074 13.1644 12.6459L11.4044 11.9126C11.1111 12.1393 10.7889 12.3326 10.4444 12.4859L10.1778 14.3526C10.1511 14.5059 10.0178 14.6193 9.85778 14.6193H7.19111C7.03111 14.6193 6.89778 14.5059 6.87111 14.3526L6.60445 12.4859C6.26 12.3326 5.93778 12.1393 5.64445 11.9126L3.88445 12.6459C3.73778 12.7074 3.57333 12.6526 3.49333 12.5126L2.16 10.1541C2.08 10.0141 2.11333 9.83741 2.23778 9.73407L3.76 8.52074C3.73087 8.35074 3.71565 8.17685 3.71565 8C3.71565 7.82315 3.73087 7.64926 3.76 7.47926L2.23778 6.26593C2.11333 6.16259 2.08 5.98593 2.16 5.84593L3.49333 3.48741C3.57333 3.34741 3.73778 3.29259 3.88445 3.35407L5.64445 4.08741C5.93778 3.86074 6.26 3.66741 6.60445 3.51407L6.87111 1.64741C6.89778 1.49407 7.03111 1.38074 7.19111 1.38074H9.85778C10.0178 1.38074 10.1511 1.49407 10.1778 1.64741L10.4444 3.51407C10.7889 3.66741 11.1111 3.86074 11.4044 4.08741L13.1644 3.35407C13.3111 3.29259 13.4756 3.34741 13.5556 3.48741L14.8889 5.84593C14.9689 5.98593 14.9356 6.16259 14.8111 6.26593L13.2889 7.47926C13.3181 7.64926 13.3333 7.82315 13.3333 8Z"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<span className="truncate">Settings</span>
						</Link>
					</li>
				</ul>

				<div className="mt-2 border-t border-stroke dark:border-stroke-dark pt-2">
					<button
						onClick={() => signOut({ callbackUrl: '/' })}
						className='mx-2 flex w-[calc(100%-16px)] items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
					>
						<span className="w-4">
							<svg
								width='16'
								height='16'
								viewBox='0 0 16 16'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
						<span className="truncate">Log Out</span>
					</button>
				</div>
			</div>
		</>
	);
}

export default AccountMenu;
