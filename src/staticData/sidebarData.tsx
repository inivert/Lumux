import { Sidebar } from "@/types/sidebar";

export const userSidebarData: Sidebar[] = [
	{
		id: 1,
		title: "Dashboard",
		path: "/user/dashboard",
		icon: (
			<svg
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M4.5 3.75C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75H4.5ZM2.25 4.5C2.25 3.25736 3.25736 2.25 4.5 2.25H19.5C20.7426 2.25 21.75 3.25736 21.75 4.5V19.5C21.75 20.7426 20.7426 21.75 19.5 21.75H4.5C3.25736 21.75 2.25 20.7426 2.25 19.5V4.5Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M7.5 8.25C7.08579 8.25 6.75 8.58579 6.75 9V17C6.75 17.4142 7.08579 17.75 7.5 17.75C7.91421 17.75 8.25 17.4142 8.25 17V9C8.25 8.58579 7.91421 8.25 7.5 8.25Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M12 6.25C11.5858 6.25 11.25 6.58579 11.25 7V17C11.25 17.4142 11.5858 17.75 12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V7C12.75 6.58579 12.4142 6.25 12 6.25Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M16.5 11.25C16.0858 11.25 15.75 11.5858 15.75 12V17C15.75 17.4142 16.0858 17.75 16.5 17.75C16.9142 17.75 17.25 17.4142 17.25 17V12C17.25 11.5858 16.9142 11.25 16.5 11.25Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
	{
		id: 2,
		title: "Profile Settings",
		path: "/user/settings",
		icon: (
			<svg
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M12 3.75C9.81196 3.75 8.0368 5.52516 8.0368 7.7132C8.0368 9.90124 9.81196 11.6764 12 11.6764C14.188 11.6764 15.9632 9.90124 15.9632 7.7132C15.9632 5.52516 14.188 3.75 12 3.75ZM6.5368 7.7132C6.5368 4.69669 8.98349 2.25 12 2.25C15.0165 2.25 17.4632 4.69669 17.4632 7.7132C17.4632 10.7297 15.0165 13.1764 12 13.1764C8.98349 13.1764 6.5368 10.7297 6.5368 7.7132Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M12 15.0072C7.36058 15.0072 3.5993 18.7685 3.5993 23.4079C3.5993 23.8221 3.26351 24.1579 2.8493 24.1579C2.43509 24.1579 2.0993 23.8221 2.0993 23.4079C2.0993 17.9402 6.53235 13.5072 12 13.5072C17.4676 13.5072 21.9007 17.9402 21.9007 23.4079C21.9007 23.8221 21.5649 24.1579 21.1507 24.1579C20.7365 24.1579 20.4007 23.8221 20.4007 23.4079C20.4007 18.7685 16.6394 15.0072 12 15.0072Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
	{
		id: 3,
		title: "Support",
		path: "/user/support",
		icon: (
			<svg
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C17.3848 2.25 21.75 6.61522 21.75 12C21.75 17.3848 17.3848 21.75 12 21.75C6.61522 21.75 2.25 17.3848 2.25 12ZM12 3.75C7.44365 3.75 3.75 7.44365 3.75 12C3.75 16.5563 7.44365 20.25 12 20.25C16.5563 20.25 20.25 16.5563 20.25 12C20.25 7.44365 16.5563 3.75 12 3.75Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M12 7.5C10.7574 7.5 9.75 8.50736 9.75 9.75C9.75 10.1642 9.41421 10.5 9 10.5C8.58579 10.5 8.25 10.1642 8.25 9.75C8.25 7.67893 9.92893 6 12 6C14.0711 6 15.75 7.67893 15.75 9.75C15.75 11.8211 14.0711 13.5 12 13.5C11.5858 13.5 11.25 13.1642 11.25 12.75V12C11.25 11.5858 11.5858 11.25 12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 9.41421 9.41421 9.75 9 9.75C8.58579 9.75 8.25 9.41421 8.25 9C8.25 6.92893 9.92893 5.25 12 5.25C14.0711 5.25 15.75 6.92893 15.75 9C15.75 10.9328 14.2678 12.5127 12.375 12.7271C12.3917 12.8161 12.4002 12.9071 12.4002 13C12.4002 13.6904 11.8406 14.25 11.1502 14.25C10.4598 14.25 9.90015 13.6904 9.90015 13C9.90015 12.3096 10.4598 11.75 11.1502 11.75H11.25V12.75C13.3211 12.75 15 11.0711 15 9C15 6.92893 13.3211 5.25 12 5.25C10.6789 5.25 9 6.92893 9 9C9 11.0711 10.6789 12.75 12 12.75C12.4142 12.75 12.75 13.0858 12.75 13.5C12.75 13.9142 12.4142 14.25 12 14.25C9.92893 14.25 8.25 12.5711 8.25 10.5C8.25 8.42893 9.92893 6.75 12 6.75C14.0711 6.75 15.75 8.42893 15.75 10.5C15.75 12.5711 14.0711 14.25 12 14.25C11.5858 14.25 11.25 13.9142 11.25 13.5C11.25 13.0858 11.5858 12.75 12 12.75Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
	{
		id: 4,
		title: "Products",
		path: "/user/products",
		icon: (
			<svg
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M12 2.25C11.2939 2.25 10.6511 2.695 10.3753 3.35942L9.79817 4.75H4.5C3.25736 4.75 2.25 5.75736 2.25 7V19C2.25 20.2426 3.25736 21.25 4.5 21.25H19.5C20.7426 21.25 21.75 20.2426 21.75 19V7C21.75 5.75736 20.7426 4.75 19.5 4.75H14.2018L13.6247 3.35942C13.3489 2.695 12.7061 2.25 12 2.25ZM11.7982 4.75L12 4.25L12.2018 4.75H11.7982ZM3.75 7C3.75 6.58579 4.08579 6.25 4.5 6.25H19.5C19.9142 6.25 20.25 6.58579 20.25 7V19C20.25 19.4142 19.9142 19.75 19.5 19.75H4.5C4.08579 19.75 3.75 19.4142 3.75 19V7Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M12 8.25C9.37665 8.25 7.25 10.3766 7.25 13C7.25 15.6234 9.37665 17.75 12 17.75C14.6234 17.75 16.75 15.6234 16.75 13C16.75 10.3766 14.6234 8.25 12 8.25ZM8.75 13C8.75 11.2051 10.2051 9.75 12 9.75C13.7949 9.75 15.25 11.2051 15.25 13C15.25 14.7949 13.7949 16.25 12 16.25C10.2051 16.25 8.75 14.7949 8.75 13Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
	{
		id: 5,
		title: "Billing",
		path: "/user/billing",
		icon: (
			<svg
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M4.5 4.75C4.08579 4.75 3.75 5.08579 3.75 5.5V18.5C3.75 18.9142 4.08579 19.25 4.5 19.25H19.5C19.9142 19.25 20.25 18.9142 20.25 18.5V5.5C20.25 5.08579 19.9142 4.75 19.5 4.75H4.5ZM2.25 5.5C2.25 4.25736 3.25736 3.25 4.5 3.25H19.5C20.7426 3.25 21.75 4.25736 21.75 5.5V18.5C21.75 19.7426 20.7426 20.75 19.5 20.75H4.5C3.25736 20.75 2.25 19.7426 2.25 18.5V5.5Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M2.25 9C2.25 8.58579 2.58579 8.25 3 8.25H21C21.4142 8.25 21.75 8.58579 21.75 9C21.75 9.41421 21.4142 9.75 21 9.75H3C2.58579 9.75 2.25 9.41421 2.25 9Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M7 14C7.41421 14 7.75 14.3358 7.75 14.75V15.25C7.75 15.6642 7.41421 16 7 16C6.58579 16 6.25 15.6642 6.25 15.25V14.75C6.25 14.3358 6.58579 14 7 14Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M12 14C12.4142 14 12.75 14.3358 12.75 14.75V15.25C12.75 15.6642 12.4142 16 12 16C11.5858 16 11.25 15.6642 11.25 15.25V14.75C11.25 14.3358 11.5858 14 12 14Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M17 14C17.4142 14 17.75 14.3358 17.75 14.75V15.25C17.75 15.6642 17.4142 16 17 16C16.5858 16 16.25 15.6642 16.25 15.25V14.75C16.25 14.3358 16.5858 14 17 14Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
];

export const adminSidebarData: Sidebar[] = [
	{
		id: 1,
		title: "Dashboard",
		path: "/admin",
		icon: (
			<svg
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M4.5 3.75C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75H4.5ZM2.25 4.5C2.25 3.25736 3.25736 2.25 4.5 2.25H19.5C20.7426 2.25 21.75 3.25736 21.75 4.5V19.5C21.75 20.7426 20.7426 21.75 19.5 21.75H4.5C3.25736 21.75 2.25 20.7426 2.25 19.5V4.5Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M7.5 8.25C7.08579 8.25 6.75 8.58579 6.75 9V17C6.75 17.4142 7.08579 17.75 7.5 17.75C7.91421 17.75 8.25 17.4142 8.25 17V9C8.25 8.58579 7.91421 8.25 7.5 8.25Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M12 6.25C11.5858 6.25 11.25 6.58579 11.25 7V17C11.25 17.4142 11.5858 17.75 12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V7C12.75 6.58579 12.4142 6.25 12 6.25Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M16.5 11.25C16.0858 11.25 15.75 11.5858 15.75 12V17C15.75 17.4142 16.0858 17.75 16.5 17.75C16.9142 17.75 17.25 17.4142 17.25 17V12C17.25 11.5858 16.9142 11.25 16.5 11.25Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
	{
		id: 2,
		title: "System Settings",
		path: "/admin/settings",
		icon: (
			<svg
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M11.9747 1.25C11.5303 1.24999 11.1592 1.24999 10.8546 1.27077C10.5375 1.29241 10.238 1.33905 9.94761 1.45933C9.27379 1.73844 8.73843 2.27379 8.45932 2.94762C8.31402 3.29842 8.27467 3.66812 8.25964 4.06996C8.24756 4.39299 8.08454 4.66251 7.84395 4.80141C7.60337 4.94031 7.28845 4.94673 7.00266 4.79568C6.64714 4.60777 6.30729 4.45699 5.93083 4.40743C5.20773 4.31223 4.47642 4.50819 3.89779 4.95219C3.64843 5.14353 3.45827 5.3796 3.28099 5.6434C3.11068 5.89681 2.92517 6.21815 2.70294 6.60307L2.67769 6.64681C2.45545 7.03172 2.26993 7.35304 2.13562 7.62723C1.99581 7.91267 1.88644 8.19539 1.84541 8.50701C1.75021 9.23012 1.94617 9.96142 2.39016 10.5401C2.62128 10.8412 2.92173 11.0602 3.26217 11.2741C3.53595 11.4461 3.68788 11.7221 3.68786 12C3.68785 12.2778 3.53592 12.5538 3.26217 12.7258C2.92169 12.9397 2.62121 13.1587 2.39007 13.4599C1.94607 14.0385 1.75012 14.7698 1.84531 15.4929C1.88634 15.8045 1.99571 16.0873 2.13552 16.3727C2.26983 16.6469 2.45535 16.9682 2.67758 17.3531L2.70284 17.3969C2.92507 17.7818 3.11058 18.1031 3.28089 18.3565C3.45817 18.6203 3.64833 18.8564 3.89769 19.0477C4.47632 19.4917 5.20763 19.6877 5.93073 19.5925C6.30717 19.5429 6.647 19.3922 7.0025 19.2043C7.28833 19.0532 7.60329 19.0596 7.8439 19.1986C8.08452 19.3375 8.24756 19.607 8.25964 19.9301C8.27467 20.3319 8.31403 20.7016 8.45932 21.0524C8.73843 21.7262 9.27379 22.2616 9.94761 22.5407C10.238 22.661 10.5375 22.7076 10.8546 22.7292C11.1592 22.75 11.5303 22.75 11.9747 22.75H12.0252C12.4697 22.75 12.8407 22.75 13.1454 22.7292C13.4625 22.7076 13.762 22.661 14.0524 22.5407C14.7262 22.2616 15.2616 21.7262 15.5407 21.0524C15.686 20.7016 15.7253 20.3319 15.7403 19.93C15.7524 19.607 15.9154 19.3375 16.156 19.1985C16.3966 19.0596 16.7116 19.0532 16.9974 19.2042C17.3529 19.3921 17.6927 19.5429 18.0692 19.5924C18.7923 19.6876 19.5236 19.4917 20.1022 19.0477C20.3516 18.8563 20.5417 18.6203 20.719 18.3565C20.8893 18.1031 21.0748 17.7818 21.297 17.3969L21.3223 17.3531C21.5445 16.9682 21.7301 16.6468 21.8644 16.3726C22.0042 16.0872 22.1135 15.8045 22.1546 15.4929C22.2498 14.7697 22.0538 14.0384 21.6098 13.4598C21.3787 13.1586 21.0782 12.9397 20.7378 12.7258C20.464 12.5538 20.3121 11.9999 20.3121 11.9999C20.3121 11.7221 20.464 11.4462 20.7377 11.2742C21.0783 11.0603 21.3788 10.8414 21.6099 10.5401C22.0539 9.96149 22.2499 9.23019 22.1547 8.50708C22.1136 8.19546 22.0043 7.91274 21.8645 7.6273C21.7302 7.35313 21.5447 7.03183 21.3224 6.64695L21.2972 6.60318C21.0749 6.21825 20.8894 5.89688 20.7191 5.64347C20.5418 5.37967 20.3517 5.1436 20.1023 4.95225C19.5237 4.50826 18.7924 4.3123 18.0692 4.4075C17.6928 4.45706 17.353 4.60782 16.9975 4.79572C16.7117 4.94679 16.3967 4.94036 16.1561 4.80144C15.9155 4.66253 15.7524 4.39297 15.7403 4.06991C15.7253 3.66808 15.686 3.2984 15.5407 2.94762C15.2616 2.27379 14.7262 1.73844 14.0524 1.45933C13.762 1.33905 13.4625 1.29241 13.1454 1.27077C12.8407 1.24999 12.4697 1.24999 12.0252 1.25H11.9747Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M12 8.25C9.92894 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92894 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
	{
		id: 3,
		title: "Manage Users",
		path: "/admin/manage-users",
		icon: (
			<svg
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M9 1.25C6.37665 1.25 4.25 3.37665 4.25 6C4.25 8.62335 6.37665 10.75 9 10.75C11.6234 10.75 13.75 8.62335 13.75 6C13.75 3.37665 11.6234 1.25 9 1.25ZM5.75 6C5.75 4.20507 7.20507 2.75 9 2.75C10.7949 2.75 12.25 4.20507 12.25 6C12.25 7.79493 10.7949 9.25 9 9.25C7.20507 9.25 5.75 7.79493 5.75 6Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M15 2.25C14.5858 2.25 14.25 2.58579 14.25 3C14.25 3.41421 14.5858 3.75 15 3.75C16.2426 3.75 17.25 4.75736 17.25 6C17.25 7.24264 16.2426 8.25 15 8.25C14.5858 8.25 14.25 8.58579 14.25 9C14.25 9.41421 14.5858 9.75 15 9.75C17.0711 9.75 18.75 8.07107 18.75 6C18.75 3.92893 17.0711 2.25 15 2.25Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M3.67815 13.5204C5.07752 12.7208 6.96067 12.25 9 12.25C11.0393 12.25 12.9225 12.7208 14.3219 13.5204C15.7 14.3079 16.75 15.5101 16.75 17C16.75 18.4899 15.7 19.6921 14.3219 20.4796C12.9225 21.2792 11.0393 21.75 9 21.75C6.96067 21.75 5.07752 21.2792 3.67815 20.4796C2.3 19.6921 1.25 18.4899 1.25 17C1.25 15.5101 2.3 14.3079 3.67815 13.5204ZM4.42236 14.8228C3.26701 15.483 2.75 16.2807 2.75 17C2.75 17.7193 3.26701 18.517 4.42236 19.1772C5.55649 19.8253 7.17334 20.25 9 20.25C10.8267 20.25 12.4435 19.8253 13.5776 19.1772C14.733 18.517 15.25 17.7193 15.25 17C15.25 16.2807 14.733 15.483 13.5776 14.8228C12.4435 14.1747 10.8267 13.75 9 13.75C7.17334 13.75 5.55649 14.1747 4.42236 14.8228Z'
					fill='currentColor'
				/>
				<path
					d='M18.1607 13.2674C17.7561 13.1787 17.3561 13.4347 17.2674 13.8393C17.1787 14.2439 17.4347 14.6439 17.8393 14.7326C18.6317 14.9064 19.2649 15.2048 19.6829 15.5468C20.1014 15.8892 20.25 16.2237 20.25 16.5C20.25 16.7507 20.1294 17.045 19.7969 17.3539C19.462 17.665 18.9475 17.9524 18.2838 18.1523C17.8871 18.2717 17.6624 18.69 17.7818 19.0867C17.9013 19.4833 18.3196 19.708 18.7162 19.5886C19.5388 19.3409 20.2743 18.9578 20.8178 18.4529C21.3637 17.9457 21.75 17.2786 21.75 16.5C21.75 15.6352 21.2758 14.912 20.6328 14.3859C19.9893 13.8593 19.1225 13.4783 18.1607 13.2674Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
	{
		id: 4,
		title: "AI Integration",
		path: "/admin/ai-integration",
		icon: (
			<svg
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M7.33569 3.38268C7.93132 1.87244 10.0687 1.87244 10.6643 3.38268L11.7363 6.10082C11.7657 6.17532 11.8247 6.23429 11.8992 6.26367L14.6173 7.33569C16.1276 7.93132 16.1276 10.0687 14.6173 10.6643L11.8992 11.7363C11.8247 11.7657 11.7657 11.8247 11.7363 11.8992L10.6643 14.6173C10.0687 16.1276 7.93132 16.1276 7.33569 14.6173L6.26367 11.8992C6.23429 11.8247 6.17532 11.7657 6.10082 11.7363L3.38268 10.6643C1.87244 10.0687 1.87244 7.93132 3.38268 7.33569L6.10082 6.26367C6.17532 6.23429 6.23429 6.17532 6.26367 6.10082L7.33569 3.38268ZM9.26891 3.93301C9.17267 3.68899 8.82733 3.689 8.73109 3.93301L7.65907 6.65115C7.47722 7.11224 7.11224 7.47722 6.65116 7.65907L3.93301 8.73109C3.68899 8.82733 3.689 9.17267 3.93301 9.26891L6.65115 10.3409C7.11224 10.5228 7.47722 10.8878 7.65907 11.3488L8.73109 14.067C8.82733 14.311 9.17267 14.311 9.26891 14.067L10.3409 11.3488C10.5228 10.8878 10.8878 10.5228 11.3488 10.3409L14.067 9.26891C14.311 9.17267 14.311 8.82733 14.067 8.73109L11.3488 7.65907C10.8878 7.47722 10.5228 7.11224 10.3409 6.65116L9.26891 3.93301ZM15.7908 13.073C16.2235 11.9757 17.7765 11.9757 18.2092 13.073L18.9779 15.0221L20.927 15.7908C22.0243 16.2235 22.0243 17.7765 20.927 18.2092L18.9779 18.9779L18.2092 20.927C17.7765 22.0243 16.2235 22.0243 15.7908 20.927L15.0221 18.9779L13.073 18.2092C11.9757 17.7765 11.9757 16.2235 13.073 15.7908L15.0221 15.0221L15.7908 13.073ZM17 14.0953L16.3856 15.6533C16.2534 15.9883 15.9883 16.2534 15.6533 16.3856L14.0953 17L15.6533 17.6144C15.9883 17.7466 16.2534 18.0117 16.3856 18.3467L17 19.9047L17.6144 18.3467C17.7466 18.0117 18.0117 17.7466 18.3467 17.6144L19.9047 17L18.3467 16.3856C18.0117 16.2534 17.7466 15.9883 17.6144 15.6533L17 14.0953Z'
					fill='currentColor'
				/>
			</svg>
		),
	}
];

export const adminSidebarOtherData: Sidebar[] = [
	{
		id: 1,
		title: "Profile Settings",
		path: "/admin/account-settings",
		icon: (
			<svg
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M9 1.25C6.37665 1.25 4.25 3.37665 4.25 6C4.25 8.62335 6.37665 10.75 9 10.75C11.6234 10.75 13.75 8.62335 13.75 6C13.75 3.37665 11.6234 1.25 9 1.25ZM5.75 6C5.75 4.20507 7.20507 2.75 9 2.75C10.7949 2.75 12.25 4.20507 12.25 6C12.25 7.79493 10.7949 9.25 9 9.25C7.20507 9.25 5.75 7.79493 5.75 6Z'
					fill='currentColor'
				/>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M3.67815 13.5204C5.07752 12.7208 6.96067 12.25 9 12.25C11.0393 12.25 12.9225 12.7208 14.3219 13.5204C15.7 14.3079 16.75 15.5101 16.75 17C16.75 18.4899 15.7 19.6921 14.3219 20.4796C12.9225 21.2792 11.0393 21.75 9 21.75C6.96067 21.75 5.07752 21.2792 3.67815 20.4796C2.3 19.6921 1.25 18.4899 1.25 17C1.25 15.5101 2.3 14.3079 3.67815 13.5204ZM4.42236 14.8228C3.26701 15.483 2.75 16.2807 2.75 17C2.75 17.7193 3.26701 18.517 4.42236 19.1772C5.55649 19.8253 7.17334 20.25 9 20.25C10.8267 20.25 12.4435 19.8253 13.5776 19.1772C14.733 18.517 15.25 17.7193 15.25 17C15.25 16.2807 14.733 15.483 13.5776 14.8228C12.4435 14.1747 10.8267 13.75 9 13.75C7.17334 13.75 5.55649 14.1747 4.42236 14.8228Z'
					fill='currentColor'
				/>
			</svg>
		),
	},
];
