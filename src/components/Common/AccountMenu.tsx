/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";

const AccountMenu = ({ user }: any) => {
	const avatarUrl = `/api/avatar?name=${encodeURIComponent(user?.name || 'User')}&size=32`;

	return (
		<>
			<div className='mb-2 flex items-center border-b border-stroke px-3 py-3 dark:border-stroke-dark'>
				<div className='relative mr-2.5 h-8 w-8 overflow-hidden rounded-full'>
					<Image
						src={avatarUrl}
						alt={user?.name || "profile"}
						fill
						className='object-cover'
						sizes="32px"
						unoptimized
						priority
					/>
				</div>
				<div className="min-w-0">
					<p className='font-satoshi text-sm font-medium text-dark dark:text-white truncate'>
						{user?.name}
					</p>
					<p className='text-xs text-body dark:text-gray-5 truncate'>
						{user?.email}
					</p>
					{user?.websiteName && (
						<p className='text-xs text-primary dark:text-primary truncate'>
							{user.websiteName}
						</p>
					)}
				</div>
			</div>

			<div className="max-h-[calc(100vh-200px)] overflow-y-auto">
				<ul>
					<li className='mx-2 mb-1'>
						<Link
							href={user?.role?.toLowerCase() === "admin" ? "/admin" : "/user"}
							className='flex w-full items-center gap-2 rounded-lg px-2.5 py-2 font-satoshi text-sm font-medium text-body hover:bg-gray-2 hover:text-dark dark:hover:bg-primary dark:hover:text-white'
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
				</ul>
			</div>
		</>
	);
};

export default AccountMenu;
