import React, { useEffect, useState } from "react";

const AdminAccessRequests = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  const fetchVerifiedUsers = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/admin/verified-users");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching verified users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchVerifiedUsers();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5050/api/admin/verified-users/${id}`, {
      method: "DELETE",
    });
    fetchVerifiedUsers();
  };

  const handleSave = async () => {
    await fetch(`http://localhost:5050/api/admin/verified-users/${editedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedUser),
    });
    setEditingUser(null);
    fetchVerifiedUsers();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Verified Users</h2>
        <button
          onClick={() => {
            localStorage.removeItem("admin_token");
            window.location.href = "/admin-login";
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Phone</th>
              <th className="px-4 py-2 border-b">Country</th>
              <th className="px-4 py-2 border-b">State</th>
              <th className="px-4 py-2 border-b">City</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) =>
              editingUser === user.id ? (
                <tr key={user.id} className="bg-yellow-50">
                  <td className="px-4 py-2 border-b">
                    <input
                      className="border px-2 py-1 rounded"
                      value={editedUser.full_name}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, full_name: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <input
                      className="border px-2 py-1 rounded"
                      value={editedUser.phone_number}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, phone_number: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <input
                      className="border px-2 py-1 rounded"
                      value={editedUser.country}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, country: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <input
                      className="border px-2 py-1 rounded"
                      value={editedUser.state}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, state: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <input
                      className="border px-2 py-1 rounded"
                      value={editedUser.city}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, city: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-2 border-b space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{user.full_name}</td>
                  <td className="px-4 py-2 border-b">{user.phone_number}</td>
                  <td className="px-4 py-2 border-b">{user.country}</td>
                  <td className="px-4 py-2 border-b">{user.state}</td>
                  <td className="px-4 py-2 border-b">{user.city}</td>
                  <td className="px-4 py-2 border-b space-x-2">
                    <button
                      onClick={() => {
                        setEditingUser(user.id);
                        setEditedUser(user);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAccessRequests;
