import { NextRequest, NextResponse } from "next/server";

export type UpdateUserData = {
  name?: string;
  email?: string;
  phone?: string;
  role?: "user" | "admin";
  avatar?: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
};

// Mock users data
const mockUsers: User[] = [
  {
    _id: "1",
    name: "Іван Петренко",
    email: "ivan@example.com",
    phone: "380501234567",
    role: "user",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    name: "Марія Коваленко",
    email: "maria@example.com",
    phone: "380631234567",
    role: "admin",
    avatar: "/avatars/admin.jpg",
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-10T14:20:00Z",
  },
  {
    _id: "3",
    name: "Олексій Шевченко",
    email: "olexii@example.com",
    role: "user",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
];

// Helper function to verify token
function verifyToken(token: string | null): boolean {
  if (!token) return false;
  // In a real app, you would verify JWT token here
  return token.startsWith("mock-token-");
}

// GET all users
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "") ?? null;

  if (!verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role");

  let filteredUsers = [...mockUsers];

  if (role) {
    filteredUsers = filteredUsers.filter((user) => user.role === role);
  }

  return NextResponse.json(filteredUsers);
}

// Update user
export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "") ?? null;

  if (!verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: { id: string; data: UpdateUserData } = await request.json();

    if (!body.id || !body.data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userIndex = mockUsers.findIndex((user) => user._id === body.id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...body.data,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      user: mockUsers[userIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// Delete user
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "") ?? null;

  if (!verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const userIndex = mockUsers.findIndex((user) => user._id === id);

  if (userIndex === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // In a real app, you would delete from database
  // mockUsers.splice(userIndex, 1);

  return NextResponse.json({
    success: true,
    message: "User marked for deletion",
  });
}

// Helper function for client-side calls
export async function getAllUsers(token: string): Promise<User[]> {
  const response = await fetch("/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function updateUser(
  id: string,
  data: UpdateUserData,
  token: string
): Promise<any> {
  const response = await fetch("/api/users", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update user");
  }

  return response.json();
}

export async function deleteUser(id: string, token: string): Promise<any> {
  const response = await fetch(`/api/users?id=${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete user");
  }

  return response.json();
}
