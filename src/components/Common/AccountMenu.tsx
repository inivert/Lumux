/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";

const AccountMenu = ({ user }: any) => {
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
					{user?.role?.toLowerCase() === "admin" ? (
						<>
							<li className='mx-2 mb-1'>
								<Link
									href="/admin/settings"
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
												d="M7.33333 16C7.06667 16 6.83333 15.9 6.66667 15.7C6.5 15.5 6.43333 15.2667 6.46667 15L6.73333 12.8C6.4 12.6667 6.1 12.5 5.83333 12.3C5.56667 12.1 5.3 11.9 5.06667 11.6667L3 12.4C2.73333 12.5 2.46667 12.4667 2.26667 12.3C2.06667 12.1333 1.96667 11.9 2 11.6L2.4 9.33333C2.13333 9.06667 1.9 8.76667 1.7 8.43333C1.5 8.1 1.33333 7.76667 1.2 7.4L0.0666667 6.86667C0.0666667 6.86667 0 6.8 0 6.66667C0 6.53333 0 6.46667 0.0666667 6.4L1.2 5.86667C1.33333 5.5 1.5 5.16667 1.7 4.83333C1.9 4.5 2.13333 4.2 2.4 3.93333L2 1.66667C1.96667 1.36667 2.06667 1.13333 2.26667 0.966667C2.46667 0.8 2.73333 0.766667 3 0.866667L5.06667 1.6C5.3 1.36667 5.56667 1.16667 5.83333 0.966667C6.1 0.766667 6.4 0.6 6.73333 0.466667L6.46667 -1.66103e-08C6.43333 -0.266667 6.5 -0.5 6.66667 -0.7C6.83333 -0.9 7.06667 -1 7.33333 -1H8.66667C8.93333 -1 9.16667 -0.9 9.33333 -0.7C9.5 -0.5 9.56667 -0.266667 9.53333 -1.66103e-08L9.26667 0.466667C9.6 0.6 9.9 0.766667 10.1667 0.966667C10.4333 1.16667 10.7 1.36667 10.9333 1.6L13 0.866667C13.2667 0.766667 13.5333 0.8 13.7333 0.966667C13.9333 1.13333 14.0333 1.36667 14 1.66667L13.6 3.93333C13.8667 4.2 14.1 4.5 14.3 4.83333C14.5 5.16667 14.6667 5.5 14.8 5.86667L15.9333 6.4C16 6.46667 16 6.53333 16 6.66667C16 6.8 16 6.86667 15.9333 6.86667L14.8 7.4C14.6667 7.76667 14.5 8.1 14.3 8.43333C14.1 8.76667 13.8667 9.06667 13.6 9.33333L14 11.6C14.0333 11.9 13.9333 12.1333 13.7333 12.3C13.5333 12.4667 13.2667 12.5 13 12.4L10.9333 11.6667C10.7 11.9 10.4333 12.1 10.1667 12.3C9.9 12.5 9.6 12.6667 9.26667 12.8L9.53333 15C9.56667 15.2667 9.5 15.5 9.33333 15.7C9.16667 15.9 8.93333 16 8.66667 16H7.33333ZM8 10.6667C8.73333 10.6667 9.36667 10.4 9.9 9.86667C10.4333 9.33333 10.7 8.7 10.7 7.96667C10.7 7.23333 10.4333 6.6 9.9 6.06667C9.36667 5.53333 8.73333 5.26667 8 5.26667C7.26667 5.26667 6.63333 5.53333 6.1 6.06667C5.56667 6.6 5.3 7.23333 5.3 7.96667C5.3 8.7 5.56667 9.33333 6.1 9.86667C6.63333 10.4 7.26667 10.6667 8 10.6667Z"
												fill="currentColor"
											/>
										</svg>
									</span>
									<span className="truncate">Settings</span>
								</Link>
							</li>
							<li className='mx-2 mb-1'>
								<Link
									href="/admin/manage-users"
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
												d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8ZM8 10C5.33333 10 0 11.3333 0 14V16H16V14C16 11.3333 10.6667 10 8 10Z"
												fill="currentColor"
											/>
										</svg>
									</span>
									<span className="truncate">Manage Users</span>
								</Link>
							</li>
							<li className='mx-2 mb-1'>
								<Link
									href="/admin/ai-integration"
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
												d="M15.3333 7.33333H13.88C13.7467 6.73333 13.5067 6.16667 13.1733 5.66667L14.2 4.64C14.4667 4.37333 14.4667 3.96 14.2 3.69333L12.3067 1.8C12.04 1.53333 11.6267 1.53333 11.36 1.8L10.3333 2.82667C9.83333 2.49333 9.26667 2.25333 8.66667 2.12V0.666667C8.66667 0.3 8.36667 0 8 0H5.33333C4.96667 0 4.66667 0.3 4.66667 0.666667V2.12C4.06667 2.25333 3.5 2.49333 3 2.82667L1.97333 1.8C1.70667 1.53333 1.29333 1.53333 1.02667 1.8L-0.866667 3.69333C-1.13333 3.96 -1.13333 4.37333 -0.866667 4.64L0.16 5.66667C-0.173333 6.16667 -0.413333 6.73333 -0.546667 7.33333H-2C-2.36667 7.33333 -2.66667 7.63333 -2.66667 8V10.6667C-2.66667 11.0333 -2.36667 11.3333 -2 11.3333H-0.546667C-0.413333 11.9333 -0.173333 12.5 0.16 13L-0.866667 14.0267C-1.13333 14.2933 -1.13333 14.7067 -0.866667 14.9733L1.02667 16.8667C1.29333 17.1333 1.70667 17.1333 1.97333 16.8667L3 15.84C3.5 16.1733 4.06667 16.4133 4.66667 16.5467V18C4.66667 18.3667 4.96667 18.6667 5.33333 18.6667H8C8.36667 18.6667 8.66667 18.3667 8.66667 18V16.5467C9.26667 16.4133 9.83333 16.1733 10.3333 15.84L11.36 16.8667C11.6267 17.1333 12.04 17.1333 12.3067 16.8667L14.2 14.9733C14.4667 14.7067 14.4667 14.2933 14.2 14.0267L13.1733 13C13.5067 12.5 13.7467 11.9333 13.88 11.3333H15.3333C15.7 11.3333 16 11.0333 16 10.6667V8C16 7.63333 15.7 7.33333 15.3333 7.33333ZM6.66667 12C4.82667 12 3.33333 10.5067 3.33333 8.66667C3.33333 6.82667 4.82667 5.33333 6.66667 5.33333C8.50667 5.33333 10 6.82667 10 8.66667C10 10.5067 8.50667 12 6.66667 12Z"
												fill="currentColor"
											/>
										</svg>
									</span>
									<span className="truncate">AI Integration</span>
								</Link>
							</li>
						</>
					) : (
						<>
							<li className='mx-2 mb-1'>
								<Link
									href="/user/settings"
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
												d="M7.33333 16C7.06667 16 6.83333 15.9 6.66667 15.7C6.5 15.5 6.43333 15.2667 6.46667 15L6.73333 12.8C6.4 12.6667 6.1 12.5 5.83333 12.3C5.56667 12.1 5.3 11.9 5.06667 11.6667L3 12.4C2.73333 12.5 2.46667 12.4667 2.26667 12.3C2.06667 12.1333 1.96667 11.9 2 11.6L2.4 9.33333C2.13333 9.06667 1.9 8.76667 1.7 8.43333C1.5 8.1 1.33333 7.76667 1.2 7.4L0.0666667 6.86667C0.0666667 6.86667 0 6.8 0 6.66667C0 6.53333 0 6.46667 0.0666667 6.4L1.2 5.86667C1.33333 5.5 1.5 5.16667 1.7 4.83333C1.9 4.5 2.13333 4.2 2.4 3.93333L2 1.66667C1.96667 1.36667 2.06667 1.13333 2.26667 0.966667C2.46667 0.8 2.73333 0.766667 3 0.866667L5.06667 1.6C5.3 1.36667 5.56667 1.16667 5.83333 0.966667C6.1 0.766667 6.4 0.6 6.73333 0.466667L6.46667 -1.66103e-08C6.43333 -0.266667 6.5 -0.5 6.66667 -0.7C6.83333 -0.9 7.06667 -1 7.33333 -1H8.66667C8.93333 -1 9.16667 -0.9 9.33333 -0.7C9.5 -0.5 9.56667 -0.266667 9.53333 -1.66103e-08L9.26667 0.466667C9.6 0.6 9.9 0.766667 10.1667 0.966667C10.4333 1.16667 10.7 1.36667 10.9333 1.6L13 0.866667C13.2667 0.766667 13.5333 0.8 13.7333 0.966667C13.9333 1.13333 14.0333 1.36667 14 1.66667L13.6 3.93333C13.8667 4.2 14.1 4.5 14.3 4.83333C14.5 5.16667 14.6667 5.5 14.8 5.86667L15.9333 6.4C16 6.46667 16 6.53333 16 6.66667C16 6.8 16 6.86667 15.9333 6.86667L14.8 7.4C14.6667 7.76667 14.5 8.1 14.3 8.43333C14.1 8.76667 13.8667 9.06667 13.6 9.33333L14 11.6C14.0333 11.9 13.9333 12.1333 13.7333 12.3C13.5333 12.4667 13.2667 12.5 13 12.4L10.9333 11.6667C10.7 11.9 10.4333 12.1 10.1667 12.3C9.9 12.5 9.6 12.6667 9.26667 12.8L9.53333 15C9.56667 15.2667 9.5 15.5 9.33333 15.7C9.16667 15.9 8.93333 16 8.66667 16H7.33333ZM8 10.6667C8.73333 10.6667 9.36667 10.4 9.9 9.86667C10.4333 9.33333 10.7 8.7 10.7 7.96667C10.7 7.23333 10.4333 6.6 9.9 6.06667C9.36667 5.53333 8.73333 5.26667 8 5.26667C7.26667 5.26667 6.63333 5.53333 6.1 6.06667C5.56667 6.6 5.3 7.23333 5.3 7.96667C5.3 8.7 5.56667 9.33333 6.1 9.86667C6.63333 10.4 7.26667 10.6667 8 10.6667Z"
												fill="currentColor"
											/>
										</svg>
									</span>
									<span className="truncate">Account Settings</span>
								</Link>
							</li>
							<li className='mx-2 mb-1'>
								<Link
									href="/user/billing"
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
												d="M14.6667 2H1.33333C0.6 2 0 2.6 0 3.33333V12.6667C0 13.4 0.6 14 1.33333 14H14.6667C15.4 14 16 13.4 16 12.6667V3.33333C16 2.6 15.4 2 14.6667 2ZM14.6667 12.6667H1.33333V8H14.6667V12.6667ZM14.6667 5.33333H1.33333V3.33333H14.6667V5.33333Z"
												fill="currentColor"
											/>
											<path
												d="M2.66667 10.6667H6V11.3333H2.66667V10.6667Z"
												fill="currentColor"
											/>
										</svg>
									</span>
									<span className="truncate">Billing</span>
								</Link>
							</li>
						</>
					)}
					<li className='mx-2 mb-1'>
						<button
							onClick={() => signOut()}
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
							<span className="truncate">Logout</span>
						</button>
					</li>
				</ul>
			</div>
		</>
	);
};

export default AccountMenu;
