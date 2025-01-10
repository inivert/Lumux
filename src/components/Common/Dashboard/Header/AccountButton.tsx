/* eslint-disable @next/next/no-img-element */
import AccountMenu from "../../AccountMenu";
import Image from "next/image";
import { useEffect, useState } from "react";
import getUpdatedData from "@/libs/getUpdatedData";

export default function AccountButton({ user }: any) {
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

	const avatarUrl = `/api/avatar?name=${encodeURIComponent(userData?.name || '')}&size=48`;

	return (
		<div className='group relative flex items-center'>
			<div className='flex items-center gap-4'>
				<div className="relative h-[48px] w-[48px] overflow-hidden rounded-full">
					<div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full animate-pulse' />
					<div className='relative h-full w-full overflow-hidden rounded-full border-4 border-white dark:border-gray-700 shadow-lg transition-transform duration-300 group-hover:scale-105'>
						<Image
							src={avatarUrl}
							alt={userData?.name || "profile"}
							fill
							className='object-cover'
							sizes="48px"
							unoptimized
							priority
							/>
					</div>
				</div>
				<p className='text-base font-medium capitalize text-dark dark:text-white'>
					{userData?.name || ''}
				</p>

				<svg
					className='group-hover:rotate-180 transition-transform duration-200'
					width='19'
					height='18'
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
			</div>

			<div className='shadow-3 border-[.5px]border-stroke invisible absolute right-0 top-15 z-999 w-[280px] rounded-lg bg-white pb-2.5 pt-3.5 opacity-0 shadow-md duration-500 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 dark:bg-gray-dark'>
				<AccountMenu user={userData} />
			</div>
		</div>
	);
}
