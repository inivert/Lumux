import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Footer = () => {
	const currentYear = new Date().getFullYear();
	
	const socialLinks = [
		{ icon: <FiTwitter className="w-5 h-5" />, href: "https://twitter.com/codelumus", label: "Twitter" },
		{ icon: <FiLinkedin className="w-5 h-5" />, href: "https://linkedin.com/in/carlos-mejiaaguirre", label: "LinkedIn" },
		{ icon: <FiMail className="w-5 h-5" />, href: "carlos@codelumus.com", label: "Email" },
	];

	return (
		<footer className="relative z-10 w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 pb-8">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
					{/* Brand Section */}
					<div className="col-span-1 lg:col-span-2">
						<Link 
							href="/" 
							className="inline-block mb-6 text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
						>
							Carlos Mejia
						</Link>
						<p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
							Freelance web developer specializing in creating beautiful, performant, and accessible web applications.
						</p>
						<div className="flex space-x-4">
							{socialLinks.map((link, index) => (
								<motion.a
									key={index}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className="p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
									aria-label={link.label}
								>
									{link.icon}
								</motion.a>
							))}
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200">
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Section */}
					<div>
						<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Get in Touch</h3>
						<div className="space-y-4">
							<p className="text-gray-600 dark:text-gray-300">
								Available for freelance opportunities
							</p>
							<Link 
								href="/contact"
								className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
							>
								Let's Talk
							</Link>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<p className="text-gray-600 dark:text-gray-300 text-sm">
							© {currentYear} CodeLumus. All rights reserved.
						</p>
						<div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-300">
							<Link href="/privacy" className="hover:text-primary transition-colors duration-200">
								Privacy Policy
							</Link>
							<Link href="/terms" className="hover:text-primary transition-colors duration-200">
								Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Background Decoration */}
			<div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
				<div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-b from-primary/30 to-purple-500/30 rounded-full blur-3xl" />
				<div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-t from-primary/30 to-purple-500/30 rounded-full blur-3xl" />
			</div>
		</footer>
	);
};

export default Footer;
