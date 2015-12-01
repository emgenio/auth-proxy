global.config = require("./helpers/default_config.js");

var should = require('should');
var expect = require('expect');
var assert = require('assert');
var rewire = require('rewire');
var ACL = rewire("../src/acl");

describe("ACL test suites", function() {
    var acl_table = require("./helpers/default_acltable.js");
    var acl_instance = new ACL(acl_table);

    describe("parse_table", function() {
        // export private acl function
        var parse_table = ACL.__get__("parse_table");

        it("should return an empty array", function() {
            assert.deepEqual([], parse_table(acl_table, 'notpresent42'));
            assert.deepEqual([], parse_table(acl_table, 'empty123321'));
        });

        it("should not inherit from themselves", function() {
            assert.deepEqual(["guest"], parse_table(acl_table, "user"));
        });

        it("should not contain roles which inherit from themselves", function() {
            assert.deepEqual(['user', 'guest'], parse_table(acl_table, "recursive_role"));
        });

        it("should return uniq roles", function() {
            var excepted = ['product_read','product_write','product_modify','recursive_role','user','guest'];
            roles = parse_table(acl_table, "product_admin")
            for (role in excepted) {
                roles.indexOf(role).should.equal(-1).not;
            }
        });
    });

    describe("hasClearance", function() {
        bad_role_chain = ["role1","role2"];
        role_chain = ['product_modify', 'users_add'];

        it("should return false if role is different of elem role chain", function() {
            assert.equal(false, acl_instance.hasClearance('user', "notinchain"));
        });

        it("should return true if role is equal to elem role chain", function() {
            assert.equal(true, acl_instance.hasClearance('user', "user"));
        });

        it("should return false if elem of role chain is not a property of role table", function() {
            assert.equal(false, acl_instance.hasClearance(bad_role_chain, "notinchain"));
        });

        it("should return false if role has not clearance", function() {
            assert.equal(true, acl_instance.hasClearance(role_chain, "guest"));
            assert.equal(true, acl_instance.hasClearance(role_chain, "user"));
        });
    });
});
    
