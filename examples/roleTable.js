module.exports = {
    guest: {
        requires_token: false
    },
    user: {
        inherits: ['guest']
    },
    users_add: {
        inherits: ['user']
    },
    users_delete: {
        inherits: ['user']
    },
    users_modify: {
        inhertis: ['user']
    },
    users_list: {
        inherits: ['user']
    },
    users_details: {
        inherits: ['user']
    },
    users_read: {
        inherits: ['users_details','users_list']
    },
    users_write: {
        inherits: ['users_read', 'users_modify', 'users_add']
    },
    users_admin: {
        inherits: ['users_write','users_delete']
    },
    account_details: {
        inherits: ['user']
    }
};
