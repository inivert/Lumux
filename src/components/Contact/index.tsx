"use client";
import React from "react";
import Breadcrumbs from "../Common/Breadcrumbs";
import { Calendar, ExternalLink, Mail, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
	const handleScheduleCall = () => {
		// Replace this URL with your actual Calendly link
		window.open("YOUR_CALENDLY_LINK_HERE", "_blank");
	};

	const fadeInUp = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.5 }
	};

	return (
		<section className="relative min-h-[80vh] overflow-hidden pb-24 pt-35 lg:pb-32">
			{/* Background Elements */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent dark:from-primary/10" />
			<div className="absolute right-0 top-20 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl filter dark:bg-primary/10" />
			<div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl filter dark:bg-primary/10" />

			{/* Breadcrumb Section */}
			<Breadcrumbs title={"Schedule a Consultation"} pages={["Home", "Contact"]} />

			<div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
				<motion.div 
					initial="initial"
					animate="animate"
					className="text-center"
				>
					<motion.div 
						{...fadeInUp}
						className="mb-8"
					>
						<h1 className="mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-gray-400 sm:text-5xl">
							Schedule Your Free Consultation
						</h1>
						<p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
							Book a convenient time for us to discuss your website needs and explore the best solutions for your business.
						</p>
					</motion.div>

					<motion.div 
						{...fadeInUp}
						transition={{ delay: 0.2 }}
						className="mx-auto max-w-xl"
					>
						<div className="relative overflow-hidden rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:bg-gray-800/50 lg:p-10">
							<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10" />
							
							<div className="relative space-y-8">
								{/* Schedule Options */}
								<div className="grid gap-6 sm:grid-cols-2">
									<motion.div
										{...fadeInUp}
										transition={{ delay: 0.3 }}
										className="rounded-2xl bg-primary/5 p-6 text-center dark:bg-primary/10"
									>
										<Clock className="mx-auto mb-3 h-8 w-8 text-primary" />
										<h3 className="mb-2 font-semibold text-gray-900 dark:text-white">30 Minutes</h3>
										<p className="text-sm text-gray-600 dark:text-gray-300">Quick overview and basic consultation</p>
									</motion.div>

									<motion.div
										{...fadeInUp}
										transition={{ delay: 0.4 }}
										className="rounded-2xl bg-primary/5 p-6 text-center dark:bg-primary/10"
									>
										<Calendar className="mx-auto mb-3 h-8 w-8 text-primary" />
										<h3 className="mb-2 font-semibold text-gray-900 dark:text-white">60 Minutes</h3>
										<p className="text-sm text-gray-600 dark:text-gray-300">Detailed discussion and planning</p>
									</motion.div>
								</div>

								{/* Schedule Button */}
								<div className="space-y-4">
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleScheduleCall}
										className="group relative w-full rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35"
									>
										<span className="flex items-center justify-center gap-2">
											Schedule Your Call Now
											<ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-1" />
										</span>
									</motion.button>

									<div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
										<span>or contact via email:</span>
										<a 
											href="mailto:your.email@example.com"
											className="inline-flex items-center gap-1 text-primary hover:underline"
										>
											<Mail className="h-4 w-4" />
											your.email@example.com
										</a>
									</div>
								</div>

								{/* What to Expect */}
								<div className="space-y-4">
									<h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">
										What to Expect
									</h3>
									<div className="space-y-3">
										<motion.div 
											{...fadeInUp}
											transition={{ delay: 0.5 }}
											className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
										>
											<CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
											<span>Choose a time that works best for you</span>
										</motion.div>
										<motion.div 
											{...fadeInUp}
											transition={{ delay: 0.6 }}
											className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
										>
											<CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
											<span>Receive instant confirmation with meeting details</span>
										</motion.div>
										<motion.div 
											{...fadeInUp}
											transition={{ delay: 0.7 }}
											className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
										>
											<CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
											<span>Discuss your needs and get personalized solutions</span>
										</motion.div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default Contact; 