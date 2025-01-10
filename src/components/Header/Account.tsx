/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AccountMenu from "../Common/AccountMenu";
import getUpdatedData from "@/libs/getUpdatedData";

const Account = ({ navbarOpen }: { navbarOpen: boolean }) => {
	const [dropdown, setDropdown] = useState(false);
	const { data: session } = useSession();
	const [userData, setUserData] = useState(session?.user);

	useEffect(() => {
		const fetchUserData = async () => {
			if (session?.user?.email) {
				const data = await getUpdatedData(session.user.email);
				if (data) {
					setUserData(data);
				}
			}
		};

		fetchUserData();
	}, [session?.user?.email]);

	return (
		<div className='group relative block'>
			<button
				onClick={() => setDropdown(!dropdown)}
				className={`flex items-center rounded-lg bg-primary px-2.5 py-1.5 text-xs sm:text-sm font-medium text-white hover:bg-primary-dark transition-colors duration-200`}
			>
				<span className="hidden sm:inline">Account</span>
				<span className="sm:hidden">
					{userData?.name?.charAt(0) || ''}
				</span>
				<svg
					className={`ml-1 transition-transform duration-200 ${dropdown ? 'rotate-180' : ''} hidden sm:block`}
					width='16'
					height='16'
					viewBox='0 0 19 18'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M4.29314 6.38394C4.49532 6.14807 4.85042 6.12075 5.0863 6.32293L9.97022 10.5092L14.8542 6.32293C15.09 6.12075 15.4451 6.14807 15.6473 6.38394C15.8495 6.61981 15.8222 6.97492 15.5863 7.17709L10.3363 11.6771C10.1256 11.8576 9.8148 11.8576 9.60415 11.6771L4.35415 7.17709C4.11828 6.97492 4.09097 6.61981 4.29314 6.38394Z'
						fill='currentColor'
					/>
				</svg>
			</button>

			<div
				className={`border-[.5px] border-stroke absolute right-0 top-full z-9999 w-[260px] rounded-lg bg-white pb-2 pt-3 shadow-md transition-all duration-200 dark:bg-gray-dark ${
					dropdown
						? "visible translate-y-1 opacity-100"
						: "invisible translate-y-0 opacity-0"
				} ${
					navbarOpen ? "xl:invisible xl:opacity-0" : ""
				}`}
			>
				<AccountMenu user={userData} />
			</div>
		</div>
	);
};

export default Account;
