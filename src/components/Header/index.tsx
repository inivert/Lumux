"use client";
import { Menu } from "@/types/menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import ThemeSwitcher from "./ThemeSwitcher";
import { getMenuData } from "./menuData";
import Account from "./Account";
import { useSession } from "next-auth/react";
import { onScroll } from "@/libs/scrollActive";
import { usePathname } from "next/navigation";
import Logo from "../Common/Logo";

const Header = () => {
	const [stickyMenu, setStickyMenu] = useState(false);
	const { data: session, status } = useSession();
	const menuData = getMenuData(session?.user?.role);
	const pathUrl = usePathname();
	const isHomePage = pathUrl === "/";

	const handleStickyMenu = () => {
		if (window.scrollY > 0) {
			setStickyMenu(true);
		} else {
			setStickyMenu(false);
		}
	};

	// Navbar toggle
	const [navbarOpen, setNavbarOpen] = useState(false);
	const navbarToggleHandler = () => {
		setNavbarOpen(!navbarOpen);
		// Prevent scrolling when menu is open
		if (!navbarOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	};

	useEffect(() => {
		if (window.location.pathname === "/") {
			window.addEventListener("scroll", onScroll);
		}

		return () => {
			window.removeEventListener("scroll", onScroll);
			// Reset overflow when component unmounts
			document.body.style.overflow = 'unset';
		};
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleStickyMenu);
		
		return () => {
			window.removeEventListener("scroll", handleStickyMenu);
		};
	}, []);

	// Don't show loading state in dashboard
	if (status === "loading" && pathUrl?.startsWith('/dashboard')) {
		return null;
	}

	return (
		<>
			<header
				className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ease-in-out ${
					stickyMenu
						? "bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md shadow-lg"
						: "bg-white/95 dark:bg-[#1e293b]/95 shadow-sm"
				}`}
			>
				<div className='relative mx-auto max-w-[1170px] h-16 flex items-center justify-between px-6 sm:px-8 lg:px-10 2xl:px-0'>
					<div className='flex h-full items-center gap-12'>
						<Logo />

						<div className="flex items-center gap-6">
							<div className="xl:hidden">
								<ThemeSwitcher />
							</div>

							<div className="xl:hidden">
								{session?.user ? (
									<Account navbarOpen={navbarOpen} />
								) : (
									<Link
										href='/auth/signin'
										className='rounded-md bg-primary px-4 py-2 font-satoshi text-sm font-medium text-white transition-colors hover:bg-primary-dark shadow-sm hover:shadow'
									>
										Sign In
									</Link>
								)}
							</div>

							<button
								onClick={navbarToggleHandler}
								aria-label='Toggle menu'
								className='relative z-50 flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 dark:border-white/10 bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 transition-colors xl:hidden'
							>
								<span className={`relative block h-5 w-5 cursor-pointer`}>
									<span className={`du-block absolute right-0 h-full w-full transition-all duration-300 ${navbarOpen ? 'opacity-0' : 'opacity-100'}`}>
										<span
											className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-gray-600 delay-[0] duration-200 ease-in-out dark:bg-white'
										></span>
										<span
											className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-gray-600 delay-150 duration-200 ease-in-out dark:bg-white'
										></span>
										<span
											className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-gray-600 delay-200 duration-200 ease-in-out dark:bg-white'
										></span>
									</span>
									<span className={`du-block absolute right-0 h-full w-full transition-all duration-300 ${navbarOpen ? 'opacity-100' : 'opacity-0'}`}>
										<span
											className='absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-gray-600 dark:bg-white'
											style={{ transform: navbarOpen ? 'rotate(45deg)' : 'rotate(0)' }}
										></span>
										<span
											className='absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-gray-600 dark:bg-white'
											style={{ transform: navbarOpen ? 'rotate(45deg)' : 'rotate(0)' }}
										></span>
									</span>
								</span>
							</button>
						</div>
					</div>

					{/* Mobile Menu */}
					<div className={`fixed inset-y-0 right-0 z-50 w-[320px] bg-white dark:bg-[#1e293b] p-6 shadow-xl transition-transform duration-300 ease-in-out xl:static xl:flex xl:h-full xl:flex-1 xl:items-center xl:bg-transparent xl:p-0 xl:shadow-none xl:dark:bg-transparent ${
						navbarOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
					}`}>
						<div className="mb-8 flex items-center justify-between xl:hidden">
							<h3 className="text-lg font-medium text-gray-900 dark:text-white">Menu</h3>
							<button
								onClick={navbarToggleHandler}
								aria-label="Close menu"
								className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 dark:border-white/10 bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
							>
								<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</button>
						</div>
						<nav className="h-[calc(100vh-100px)] overflow-y-auto">
							<ul className='flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-center xl:gap-8'>
								{menuData?.map((item: Menu, key) =>
									!item?.path && item?.submenu ? (
										<Dropdown
											stickyMenu={stickyMenu}
											item={item}
											key={key}
											setNavbarOpen={setNavbarOpen}
										/>
									) : (
										<li
											key={key}
											className={`${
												item?.submenu ? "group relative" : "nav__menu"
											}`}
										>
											<Link
												onClick={() => setNavbarOpen(false)}
												href={
													item?.path
														? item?.path.includes("#") && !item?.newTab
															? `/${item?.path}`
															: item?.path
														: ""
												}
												target={item?.newTab ? "_blank" : ""}
												rel={item?.newTab ? "noopener noreferrer" : ""}
												className={`flex rounded-md px-4 py-2 font-satoshi text-sm font-medium transition-colors ${
													pathUrl === item?.path
														? "text-primary"
														: "text-gray-700 hover:text-primary dark:text-gray-100 dark:hover:text-primary"
												} ${item?.path?.startsWith("#") ? "menu-scroll" : ""}`}
											>
												{item?.title}
											</Link>
										</li>
									)
								)}
							</ul>
						</nav>
					</div>

					<div className='hidden xl:flex h-full items-center gap-8'>
						<ThemeSwitcher />

						{session?.user ? (
							<Account navbarOpen={navbarOpen} />
						) : (
							<Link
								href='/auth/signin'
								className='rounded-md bg-primary px-4 py-2 font-satoshi text-sm font-medium text-white transition-colors hover:bg-primary-dark shadow-sm hover:shadow'
							>
								Sign In
							</Link>
						)}
					</div>
				</div>
			</header>
			{/* Reduced spacing below header */}
			<div className="h-16" />
		</>
	);
};

export default Header;
