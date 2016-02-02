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

    describe("allow request middleware", function() {
        var supertest = require('supertest');
        var app = require('express')();
        var expected = "requires_token: false"

        var role = "guest"
        var role_table = require("./helpers/roleTable.js");
        app.get("/", function(req, res) {
            var acl = new ACL(role_table);
            acl.allow(role)(req, res, function() {
                res.status(200).send(expected);
            });
        });

        app.get("/not_property_of_acl_table", function(req, res) {
            var acl = new ACL(role_table);
            acl.allow("not_property")(req, res, function() {
                res.status(200).send(expected);
            });
        });

        app.get("/missing_api_key", function(req, res) {
            var acl = new ACL(role_table);
            acl._acl_table.guest.requires_token = true;
            req.key_roles = false;
            acl.allow(role)(req, res, function() {
                res.status(200).send(expected);
            });
        });

        var refused_role = "no_role"
        app.get("/api_key_unauthorized", function(req, res) {
            var acl = new ACL(role_table);
            acl._acl_table.guest.requires_token = true;
            req.key_roles = refused_role;
            acl.allow(role)(req, res, function() {
                res.status(200).send(expected);
            });
        });

        app.get("/all_shiny", function(req, res) {
            var acl = new ACL(role_table);
            acl._acl_table.guest.requires_token = true;
            req.key_roles = role;
            acl.allow(role)(req, res, function() {
                res.status(200).send(expected);
            });
        });

        it("should pass if token required present and set to false", function(done) {
            supertest(app)
                .get("/not_property_of_acl_table")
                .expect(403, {
                    error: { status: 'Unauthorized', reason: 'Cannot process the request'}
                }, done);
        });

        it("should pass if token required present and set to false", function(done) {
            supertest(app)
                .get("/")
                .expect(200, expected, done);
        });

        it("should not pass due to lack of authorization", function(done) {
            supertest(app)
                .get("/missing_api_key")
                .expect(403, {
                    error: { status: 'Unauthorized', reason: 'API Key Missing'}
                }, done);
        });

        it("should not pass due to the non-authorized API key", function(done) {
            supertest(app)
                .get("/api_key_unauthorized")
                .expect(403, {
                    error: { status: 'Unauthorized', reason: 'Not authorized to access this endpoint' },
                    meta: { details: 'Endpoint requires ' + role + ' permission', authorized_for: refused_role }
                }, done);
        });

        it("should be all shiny :)", function(done) {
            supertest(app)
                .get("/all_shiny")
                .expect(200, expected, done);
        });
    });
});