import { Metadata } from "next";
import NoInvitation from "@/components/Auth/NoInvitation";

export const metadata: Metadata = {
  title: `No Invitation - ${process.env.SITE_NAME}`,
  description: `Access restricted - invitation required`,
};

export default function NoInvitationPage() {
  return <NoInvitation />;
} 