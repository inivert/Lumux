/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { signOut } from "next-auth/react";
import { userMenuData, adminMenuData } from "@/staticData/sidebarData";
import { usePathname } from "next/navigation";

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
			<div className='mb-2 flex items-center border-b border-stroke px-6 pb-3.5 dark:border-stroke-dark'>
				<div className='mr-3'>
					<img
						src={profilePic}
						alt={user?.name || "profile"}
						className='h-[48px] w-[48px] overflow-hidden rounded-full'
					/>
				</div>
				<div>
					<p className='font-satoshi text-base font-medium text-dark dark:text-white'>
						{user?.name}
					</p>
					<p className='text-sm text-body dark:text-gray-5'>{user?.email}</p>
				</div>
			</div>
			<div>
				<ul className=''>
					{sidebarData?.map((item: any) => (
						<li key={item?.id} className='mx-2.5 mb-1'>
							<Link
								href={`${user?.role?.toLowerCase()}${item?.path}`}
								className={`flex w-full items-center gap-2 rounded-lg px-3.5 py-2.5 font-satoshi font-medium text-body hover:bg-gray-2 hover:text-dark dark:hover:bg-primary dark:hover:text-white ${
									pathname === item?.path
										? "bg-gray-2 text-dark dark:bg-primary dark:text-white"
										: ""
								}`}
							>
								<span>{item?.icon}</span>
								{item?.title}
							</Link>
						</li>
					))}
					<li className='mx-2.5 mb-1'>
						<button
							onClick={() => signOut({ callbackUrl: "/" })}
							className='flex w-full items-center gap-2 rounded-lg px-3.5 py-2.5 font-satoshi font-medium text-body hover:bg-gray-2 hover:text-dark dark:hover:bg-primary dark:hover:text-white'
						>
							<span>
								<svg
									className='fill-current'
									width='18'
									height='18'
									viewBox='0 0 18 18'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M15.7499 2.9812H14.2874V2.36245C14.2874 2.02495 14.0062 1.71558 13.6405 1.71558C13.2749 1.71558 12.9937 1.99683 12.9937 2.36245V2.9812H4.97803V2.36245C4.97803 2.02495 4.69678 1.71558 4.33115 1.71558C3.96553 1.71558 3.68428 1.99683 3.68428 2.36245V2.9812H2.24991C1.29991 2.9812 0.478027 3.77495 0.478027 4.75308V14.5406C0.478027 15.4906 1.27178 16.3125 2.24991 16.3125H15.7499C16.6999 16.3125 17.5218 15.5187 17.5218 14.5406V4.72495C17.5218 3.77495 16.7281 2.9812 15.7499 2.9812ZM1.77178 8.21245H4.1624V10.9968H1.77178V8.21245ZM5.42803 8.21245H8.38115V10.9968H5.42803V8.21245ZM8.38115 12.2625V15.0187H5.42803V12.2625H8.38115ZM9.64678 12.2625H12.5999V15.0187H9.64678V12.2625ZM9.64678 8.21245H12.5999V10.9968H9.64678V8.21245ZM13.8374 8.21245H16.228V10.9968H13.8374V8.21245ZM2.24991 4.24683H3.71241V4.83745C3.71241 5.17495 3.99366 5.48433 4.35928 5.48433C4.72491 5.48433 5.00616 5.20308 5.00616 4.83745V4.24683H13.0499V4.83745C13.0499 5.17495 13.3312 5.48433 13.6968 5.48433C14.0624 5.48433 14.3437 5.20308 14.3437 4.83745V4.24683H15.7499C16.0312 4.24683 16.2562 4.47183 16.2562 4.75308V6.94683H1.77178V4.75308C1.77178 4.47183 1.96866 4.24683 2.24991 4.24683ZM1.77178 14.5125V12.2343H4.1624V14.9906H2.24991C1.96866 15.0187 1.77178 14.7937 1.77178 14.5125ZM15.7499 15.0187H13.8374V12.2625H16.228V14.5406C16.2562 14.7937 16.0312 15.0187 15.7499 15.0187Z'
										fill=''
									/>
								</svg>
							</span>
							Sign Out
						</button>
					</li>
				</ul>
			</div>
		</>
	);
};

export default AccountMenu;
