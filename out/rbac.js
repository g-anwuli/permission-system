var ROLES1 = {
    admin: ["view:posts", "create:posts", "update:posts", "delete:posts"],
    user: ["view:posts"],
};
var handlePermission = function (user, permission) {
    return user.roles.some(function (r) {
        var permissions = ROLES1[r];
        return permissions.some(function (p) { return p === permission; });
    });
};
var user1 = { id: 12, roles: ["user"] };
if (handlePermission(user1, "create:posts")) {
    console.log("Passed the gaurd");
}
