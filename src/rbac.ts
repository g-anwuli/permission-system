type User1 = {
  id: number;
  roles: Role1[];
};

type Role1 = "admin" | "user";

const ROLES1 = {
  admin: ["view:posts", "create:posts", "update:posts", "delete:posts"],
  user: ["view:posts"],
} as const;

type Permission1 = (typeof ROLES1)[Role1][number];

const handlePermission = (user: User1, permission: Permission1) => {
  return user.roles.some((r) => {
    const permissions = ROLES1[r] as readonly Permission1[];
    return permissions.some((p) => p === permission);
  });
};

const user1: User1 = { id: 12, roles: ["user"] };

if (handlePermission(user1, "create:posts")) {
  console.log("Passed the gaurd");
}
