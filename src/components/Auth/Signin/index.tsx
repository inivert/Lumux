"use client";
import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
	return (
		<>
			<div className='mx-auto w-full max-w-[400px] px-4 py-10'>
				<div className='text-center mb-7.5'>
					<h3 className='mb-4 font-satoshi text-heading-5 font-bold text-dark dark:text-white'>
						Sign In
					</h3>
					<p className='text-base dark:text-gray-5'>
						Access is invitation only. Please use your invited email address.
					</p>
				</div>

				<div className='space-y-3 pb-7.5'>
					<GoogleSigninButton text='Sign in' />
				</div>

				<div className='mb-7.5 flex items-center justify-center'>
					<span className='block h-px w-full bg-stroke dark:bg-stroke-dark'></span>
					<div className='inline-block bg-white px-3 text-base text-body dark:bg-[#151F34] dark:text-gray-5'>
						OR
					</div>
					<span className='block h-px w-full bg-stroke dark:bg-stroke-dark'></span>
				</div>

				<SigninWithPassword />

				<div className='mt-7.5 text-center'>
					<p className='mb-3 text-base text-gray-500 dark:text-gray-400'>
						First time logging in?
					</p>
					<Link
						href='/auth/invite'
						className='inline-flex h-12 min-w-[200px] items-center justify-center rounded-lg bg-primary/10 px-6 font-satoshi text-base font-medium text-primary transition-colors hover:bg-primary/20'
					>
						Set Up Your Account
					</Link>
				</div>
			</div>
		</>
	);
}
