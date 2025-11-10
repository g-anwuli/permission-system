type User = {
  id: number;
  roles: Role[];
  blockedBy: number[];
};

type Post = {
  id: string;
  authorId: number;
  title: string;
  body: string;
  createdAt: string;
};

type aComment = {
  id: string;
  postId: string;
  authorId: number;
  content: string;
  createdAt: string;
};

type Role = "admin" | "user" | "guest";

type aPermissions = {
  post: {
    dataType: Post;
    actions: "create" | "view" | "update" | "delete";
  };
  comment: {
    dataType: aComment;
    actions: "create" | "view" | "delete";
  };
};

type PermissionCheck<Key extends keyof aPermissions> =
  | boolean
  | ((user: User, data: aPermissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: {
    [Key in keyof aPermissions]: {
      [Action in aPermissions[Key]["actions"]]: PermissionCheck<Key>;
    };
  };
};

const ROLES = {
  admin: {
    post: {
      create: true,
      view: true,
      update: true,
      delete: true,
    },
    comment: {
      create: true,
      view: true,
      delete: true,
    },
  },
  user: {
    post: {
      create: true,
      view: (user, post) => !user.blockedBy.some((u) => u === post.authorId),
      update: (user, post) => post.authorId === user.id,
      delete: (user, post) => post.authorId === user.id,
    },
    comment: {
      create: true,
      view: (user, post) => !user.blockedBy.some((u) => u === post.authorId),
      delete: (user, c) => user.id === c.authorId,
    },
  },
  guest: {
    post: {
      create: false,
      view: true,
      update: false,
      delete: false,
    },
    comment: {
      create: false,
      view: true,
      delete: false,
    },
  },
} as const satisfies RolesWithPermissions;

const hasPermission = <Resource extends keyof aPermissions>(
  user: User,
  resource: Resource,
  action: aPermissions[Resource]["actions"],
  data?: aPermissions[Resource]["dataType"]
) => {
  return user.roles.some((r) => {
    const _action = (ROLES as RolesWithPermissions)[r][resource]?.[action];

    if (typeof _action === "function" && data) {
      return _action(user, data);
    }

    return _action;
  });
};

const user: User = { id: 1, roles: ["user"], blockedBy: [2, 3] };
const post: Post = {
  id: "sfwefe",
  authorId: 1,
  title: "Testing",
  body: "Hello world",
  createdAt: new Date().toUTCString(),
};

if (hasPermission(user, "post", "create")) {
  console.log("I can create a post");
}

if (hasPermission(user, "post", "delete", post)) {
  console.log("I can delete a post");
}
