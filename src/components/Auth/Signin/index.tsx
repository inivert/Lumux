"use client";
import { useState } from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithMagicLink from "../SigninWithMagicLink";
import { motion } from "framer-motion";

export default function Signin() {
	const [activeTab, setActiveTab] = useState<'magic-link' | 'password'>('magic-link');

	return (
		<div className="w-full px-6 sm:px-8 py-8 sm:py-10">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center mb-8"
			>
				<h3 className="mb-3 text-2xl font-bold text-white">
					Welcome Back
				</h3>
				<p className="text-base text-gray-300">
					Access is invitation only. Please use your invited email address.
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="space-y-4"
			>
				<GoogleSigninButton text="Continue with Google" />
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="my-8 flex items-center justify-center gap-4"
			>
				<span className="block h-px flex-1 bg-gray-700/50" />
				<div className="text-sm font-medium text-gray-300">
					or continue with email
				</div>
				<span className="block h-px flex-1 bg-gray-700/50" />
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="mb-5"
			>
				<SigninWithMagicLink />
			</motion.div>
		</div>
	);
}
