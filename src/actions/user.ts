"use server";
import { prisma } from "@/libs/prisma";
import { isAuthorized } from "@/libs/isAuthorized";

export async function getUsers(filter: any) {
	const currentUser = await isAuthorized();

	const res = await prisma.user.findMany({
		where: {
			role: filter,
		},
	});

	const filtredUsers = res.filter(
		(user) => user.email !== currentUser?.email
	);

	return filtredUsers;
}

export async function updateUser(data: any) {
	const { email } = data;
	return await prisma.user.update({
		where: {
			email: email.toLowerCase(),
		},
		data: {
			email: email.toLowerCase(),
			...data,
		},
	});
}

export async function deleteUser(id: string) {
	try {
		const user = await prisma.user.delete({
			where: {
				id,
			},
		});

		return user;
	} catch (error) {
		return new Error("Failed to delete user");
	}
}

export async function serchUser(email: string) {
	return await prisma.user.findUnique({
		where: {
			email: email.toLowerCase(),
		},
	});
}
