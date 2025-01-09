"use client";
import { useState } from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithMagicLink from "../SigninWithMagicLink";
import DemoSignin from "./DemoSignin";

export default function Signin() {
	return (
		<>
			<div className='mx-auto w-full max-w-[400px] px-4 py-10'>
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

				<div className='mb-5'>
					<SigninWithMagicLink />
				</div>

				<span className='my-10 block h-px w-full bg-stroke dark:bg-stroke-dark '></span>

				<DemoSignin />
			</div>
		</>
	);
}
