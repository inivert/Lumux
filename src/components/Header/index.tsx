"use client";
import logoLight from "@/../public/images/logo/logo-light.svg";
import logo from "@/../public/images/logo/logo.svg";
import { Menu } from "@/types/menu";
import Image from "next/image";
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
	const isDashboard = pathUrl?.startsWith('/dashboard');

	// Don't render header at all in dashboard
	if (isDashboard) {
		return null;
	}

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
	if (status === "loading" && isDashboard) {
		return null;
	}

	return (
		<>
			<header
				className={`fixed left-0 top-0 z-999 w-full h-16 transition-all duration-300 ease-in-out ${
					stickyMenu
						? "bg-white shadow dark:bg-dark"
						: "bg-transparent"
				}`}
			>
				<div className='relative mx-auto max-w-[1170px] h-full flex items-center justify-between px-4 sm:px-8 xl:px-8 2xl:px-0'>
					<div className='flex h-full items-center xl:w-auto xl:mr-16'>
						<Logo />

						<div className="flex items-center gap-1.5">
							<div className="xl:hidden">
								<ThemeSwitcher />
							</div>

							<div className="xl:hidden">
								{session?.user ? (
									<Account navbarOpen={navbarOpen} />
								) : (
									<Link
										href='/auth/signin'
										className='rounded-lg bg-primary px-3 py-1.5 font-satoshi text-sm font-medium text-white hover:bg-primary-dark'
									>
										Sign In
									</Link>
								)}
							</div>

							<button
								onClick={navbarToggleHandler}
								aria-label='Toggle menu'
								className='relative z-50 flex h-7 w-7 items-center justify-center rounded-lg border border-stroke bg-white dark:border-strokedark dark:bg-dark xl:hidden'
							>
								<span className={`relative block h-5 w-5 cursor-pointer`}>
									<span className={`du-block absolute right-0 h-full w-full transition-all duration-300 ${navbarOpen ? 'opacity-0' : 'opacity-100'}`}>
										<span
											className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white'
										></span>
										<span
											className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white'
										></span>
										<span
											className='relative left-0 top-0 my-1 block h-0.5 w-full rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white'
										></span>
									</span>
									<span className={`du-block absolute right-0 h-full w-full transition-all duration-300 ${navbarOpen ? 'opacity-100' : 'opacity-0'}`}>
										<span
											className='absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black dark:bg-white'
											style={{ transform: navbarOpen ? 'rotate(45deg)' : 'rotate(0)' }}
										></span>
										<span
											className='absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black dark:bg-white'
											style={{ transform: navbarOpen ? 'rotate(45deg)' : 'rotate(0)' }}
										></span>
									</span>
								</span>
							</button>
						</div>
					</div>

					{/* Mobile Menu Backdrop */}
					{navbarOpen && (
						<div 
							className="fixed inset-0 bg-black/20 backdrop-blur-sm xl:hidden"
							onClick={navbarToggleHandler}
							aria-hidden="true"
						/>
					)}

					{/* Mobile Menu */}
					<div className={`fixed inset-y-0 right-0 z-50 w-[300px] bg-white dark:bg-dark p-6 transition-transform duration-300 ease-in-out xl:static xl:flex xl:h-full xl:flex-1 xl:items-center xl:bg-transparent xl:p-0 xl:dark:bg-transparent ${
						navbarOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'
					}`}>
						<div className="mb-8 flex items-center justify-between xl:hidden">
							<h3 className="text-xl font-bold text-black dark:text-white">Menu</h3>
							<button
								onClick={navbarToggleHandler}
								aria-label="Close menu"
								className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-white hover:bg-gray-100 dark:border-strokedark dark:bg-dark dark:hover:bg-gray-800"
							>
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</button>
						</div>
						<nav className="h-[calc(100vh-120px)] overflow-y-auto">
							<ul className='flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-center xl:gap-10'>
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
											} ${stickyMenu ? "xl:py-2" : "xl:py-2"}`}
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
												className={`flex rounded-lg px-3 py-1.5 font-satoshi text-sm font-medium ${
													pathUrl === item?.path
														? "bg-primary/5 text-primary dark:bg-white/5 dark:text-white"
														: "text-gray-600 hover:bg-primary/5 hover:text-primary dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
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

					<div className='hidden xl:flex h-full items-center gap-6'>
						<ThemeSwitcher />

						{session?.user ? (
							<Account navbarOpen={navbarOpen} />
						) : (
							<Link
								href='/auth/signin'
								className='rounded-lg bg-primary px-4 py-2 font-satoshi text-sm font-medium text-white hover:bg-primary-dark'
							>
								Sign In
							</Link>
						)}
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
