/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { signOut } from "next-auth/react";
import { userMenuData, adminMenuData } from "@/staticData/sidebarData";
import { usePathname } from "next/navigation";
import Image from "next/image";

const AccountMenu = ({ user }: any) => {
	const pathname = usePathname();
	const sidebarData = user?.role === "USER" ? userMenuData : adminMenuData;

	const profilePic = user?.image
		? user.image.includes("http")
			? user.image
			: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${user.image}`
		: "/images/dashboard/profile-avatar.png";

	return (
		<>
			<div className='mb-2 flex items-center border-b border-stroke px-3 py-3 dark:border-stroke-dark'>
				<div className='relative mr-2.5 h-8 w-8 overflow-hidden rounded-full'>
					<Image
						src={profilePic}
						alt={user?.name || "profile"}
						fill
						className='object-cover'
						sizes="32px"
					/>
				</div>
				<div className="min-w-0">
					<p className='font-satoshi text-sm font-medium text-dark dark:text-white truncate'>
						{user?.name}
					</p>
					<p className='text-xs text-body dark:text-gray-5 truncate'>
						{user?.email}
					</p>
				</div>
			</div>

			<div className="max-h-[calc(100vh-200px)] overflow-y-auto">
				<ul className=''>
					{sidebarData?.map((item: any) => (
						<li key={item?.id} className='mx-2 mb-1'>
							<Link
								href={`${item?.path}`}
								className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 font-satoshi text-sm font-medium text-body hover:bg-gray-2 hover:text-dark dark:hover:bg-primary dark:hover:text-white ${
									pathname === item?.path
										? "bg-gray-2 text-dark dark:bg-primary dark:text-white"
										: ""
								}`}
							>
								<span className="w-4">{item?.icon}</span>
								<span className="truncate">{item?.title}</span>
							</Link>
						</li>
					))}

					<li className='mx-2'>
						<button
							onClick={() => signOut()}
							className='flex w-full items-center gap-2 rounded-lg px-2.5 py-2 font-satoshi text-sm font-medium text-body hover:bg-gray-2 hover:text-dark dark:hover:bg-primary dark:hover:text-white'
						>
							<span className='w-4'>
								<svg
									width='16'
									height='16'
									viewBox='0 0 18 18'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g clipPath='url(#clip0_2251_109)'>
										<path
											fillRule='evenodd'
											clipRule='evenodd'
											d='M3.75 2.25C3.75 1.83579 4.08579 1.5 4.5 1.5H9C9.41421 1.5 9.75 1.83579 9.75 2.25C9.75 2.66421 9.41421 3 9 3H4.5C4.08579 3 3.75 2.66421 3.75 2.25Z'
											fill='currentColor'
										/>
										<path
											fillRule='evenodd'
											clipRule='evenodd'
											d='M3.75 15.75C3.75 15.3358 4.08579 15 4.5 15H9C9.41421 15 9.75 15.3358 9.75 15.75C9.75 16.1642 9.41421 16.5 9 16.5H4.5C4.08579 16.5 3.75 16.1642 3.75 15.75Z'
											fill='currentColor'
										/>
										<path
											fillRule='evenodd'
											clipRule='evenodd'
											d='M2.25 3.75C2.66421 3.75 3 4.08579 3 4.5V13.5C3 13.9142 2.66421 14.25 2.25 14.25C1.83579 14.25 1.5 13.9142 1.5 13.5V4.5C1.5 4.08579 1.83579 3.75 2.25 3.75Z'
											fill='currentColor'
										/>
										<path
											fillRule='evenodd'
											clipRule='evenodd'
											d='M6.75 9C6.75 8.58579 7.08579 8.25 7.5 8.25H15.75C16.1642 8.25 16.5 8.58579 16.5 9C16.5 9.41421 16.1642 9.75 15.75 9.75H7.5C7.08579 9.75 6.75 9.41421 6.75 9Z'
											fill='currentColor'
										/>
										<path
											fillRule='evenodd'
											clipRule='evenodd'
											d='M11.4697 4.71967C11.7626 4.42678 12.2374 4.42678 12.5303 4.71967L16.2803 8.46967C16.5732 8.76256 16.5732 9.23744 16.2803 9.53033L12.5303 13.2803C12.2374 13.5732 11.7626 13.5732 11.4697 13.2803C11.1768 12.9874 11.1768 12.5126 11.4697 12.2197L14.6893 9L11.4697 5.78033C11.1768 5.48744 11.1768 5.01256 11.4697 4.71967Z'
											fill='currentColor'
										/>
									</g>
									<defs>
										<clipPath id='clip0_2251_109'>
											<rect width='18' height='18' rx='5' fill='white' />
										</clipPath>
									</defs>
								</svg>
							</span>
							<span className="truncate">Logout</span>
						</button>
					</li>
				</ul>
			</div>
		</>
	);
};

export default AccountMenu;
