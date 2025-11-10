var ROLES = {
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
            view: function (user, post) { return !user.blockedBy.some(function (u) { return u === post.authorId; }); },
            update: function (user, post) { return post.authorId === user.id; },
            delete: function (user, post) { return post.authorId === user.id; },
        },
        comment: {
            create: true,
            view: function (user, post) { return !user.blockedBy.some(function (u) { return u === post.authorId; }); },
            delete: function (user, c) { return user.id === c.authorId; },
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
};
var hasPermission = function (user, resource, action, data) {
    return user.roles.some(function (r) {
        var _a;
        var _action = (_a = ROLES[r][resource]) === null || _a === void 0 ? void 0 : _a[action];
        if (typeof _action === "function" && data) {
            return _action(user, data);
        }
        return _action;
    });
};
var user = { id: 1, roles: ["user"], blockedBy: [2, 3] };
var post = {
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
