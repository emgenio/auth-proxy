# Auth Proxy
A node-based microservice which works as an authorization gateway and reverse proxy.

## How Emgen Auth Proxy (eap) Works
EAP is setup behind a reverse proxy and handles all requests, checking a [Javascript Web Token](http://jwt.io/) for a list of `key_roles` against a required role for an endpoint. For instance an endpoint `/a` might require the `user` role. If the `user` role is found against the Web Token's roles or a role it inherits from, the request is forwarded to the correct microservice. If not, eap will issue a NotAuthorized response and deny the request before it even hits the microservice.

Authorizing a user and setting a JWT is not part of the scope of this project.

## Common Environment
Your setup should probably look like this:

![](https://s3.amazonaws.com/cdn.richas.biz/auth-proxy.png)

## How to install
1. Make sure you have the latest version of node and npm
2. Run `npm install -g emgen-auth-proxy`
3. Create a folder in etc called `eap`
4. Copy the `config.yml` file from the examples folder here
5. Run `eap` from your command line.

You probably want to put together a conf file so that `eap` runs with a process controller like upstart or systemctl.

## Configuring Auth Proxy
There's a number of configuration options available, explained in the `examples/config.yml`.

Apart from the standard config, you also need to setup a *role table* and *route map* for each of your microservices. The most decoupled way would be to setup a DB and create a new storage module which pulls the *role table* and *route map* on initialization (The interface for storage modules is found in `examples/storage.js`).

Alternatively you can dynamically add and remove role tables and route maps by enabling the in-built api.

## Role Tables
A role table is a list of roles which inherit from other roles. An example role table is available in `examples/roleTable.js`

## Route Maps
A route map is a simple `key -> value` system where a path (the key) has a role (the value). A route map might look something like this:

```
{
	'/api/orders/delete': 'order-delete',
	'/api/users/list': 'user-read'
}
```

At the moment paths are not *method aware* so there is no way to assign a role for each different http method.

## Licence
Emgen Auth Proxy is Copyright 2015 Daniel J Holmes and licenced under the GPL-Compatible MIT Standard Licence.