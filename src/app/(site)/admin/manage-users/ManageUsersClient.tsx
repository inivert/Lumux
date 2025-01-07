"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ManageUsersClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<any[]>([]);

  // Fetch invitations on component mount
  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await fetch("/api/admin/invitations");
      if (!response.ok) throw new Error("Failed to fetch invitations");
      const data = await response.json();
      setInvitations(data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast.error("Failed to fetch invitations");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success("Invitation sent successfully");
      setEmail("");
      fetchInvitations();
    } catch (error: any) {
      console.error("Error sending invitation:", error);
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvitation = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/invitations?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete invitation");

      toast.success("Invitation deleted successfully");
      fetchInvitations();
    } catch (error) {
      console.error("Error deleting invitation:", error);
      toast.error("Failed to delete invitation");
    }
  };

  return (
    <div className="space-y-8">
      {/* Invite Form */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Invite New User</h2>
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </form>
      </div>

      {/* Invitations List */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Active Invitations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {invitations.map((invitation) => (
                <tr key={invitation.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {invitation.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {invitation.role}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {invitation.accepted ? "Accepted" : "Pending"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {new Date(invitation.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      onClick={() => handleDeleteInvitation(invitation.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 