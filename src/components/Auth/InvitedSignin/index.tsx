"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
});

export default function InvitedSignin() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true);

			// First check if the email has a valid invitation
			const checkResponse = await fetch("/api/user/invite/check", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (!checkResponse.ok) {
				const error = await checkResponse.text();
				throw new Error(error);
			}

			// Sign in with credentials
			const result = await signIn("credentials", {
				email: values.email,
				password: "", // Empty password for first-time login
				redirect: false,
			});

			if (result?.error) {
				throw new Error(result.error);
			}

			toast.success("Please set up your password in settings");
			router.push("/dashboard");
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder='Enter your email'
									{...field}
									disabled={isLoading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full' disabled={isLoading}>
					{isLoading ? "Verifying..." : "Continue"}
				</Button>
			</form>
		</Form>
	);
}
