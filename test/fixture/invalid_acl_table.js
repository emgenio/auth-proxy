var acl_table = {
    guest: {
        requires_token: false
    },
    user: {
        inherits: ['user', 'guest', 'user']
    },
    users_add: {
        inherits: ['user']
    },
    product_write: {
        inherits: ['user']
    },
    product_modify: {
        inherits: ['user']
    },
    product_admin: {
        inherits: ['product_write','product_read','product_modify',"recursive_role"]
    },
    recursive_role: {
        inherits:  ["recursive_role", "user"]
    }
}

module.exports = acl_table;