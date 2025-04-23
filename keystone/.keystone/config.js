var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var import_basic_auth = __toESM(require("basic-auth"));
var requireAuth = (req, res, next) => {
  const user = (0, import_basic_auth.default)(req);
  if (user && user.name === "admin" && user.pass === "admin1111") {
    next();
  } else {
    res.set("WWW-Authenticate", 'Basic realm="Keystone"');
    res.status(401).send("Authentication required.");
  }
};
var keystone_default = (0, import_core.config)({
  db: {
    provider: "sqlite"
    // url: 'file:../backend/prisma/dev.db',
  },
  storage: {
    images: {
      kind: "local",
      type: "image",
      generateUrl: (path) => `/uploads/images/${path}`,
      serverRoute: {
        path: "/uploads/images"
      },
      storagePath: "uploads/images"
    },
    videos: {
      kind: "local",
      type: "file",
      generateUrl: (path) => `/uploads/videos/${path}`,
      serverRoute: {
        path: "/uploads/videos"
      },
      storagePath: "uploads/videos"
    }
  },
  lists: {
    User: (0, import_core.list)({
      access: import_access.allowAll,
      fields: {
        telegramId: (0, import_fields.integer)({
          validation: { isRequired: true },
          isIndexed: "unique",
          db: { isNullable: false }
        }),
        username: (0, import_fields.text)({
          validation: { isRequired: true },
          db: { isNullable: false }
        }),
        lastName: (0, import_fields.text)({
          db: { isNullable: true }
        }),
        firstName: (0, import_fields.text)({
          db: { isNullable: true }
        }),
        photoUrl: (0, import_fields.text)({
          db: { isNullable: true }
        }),
        balance: (0, import_fields.float)({
          defaultValue: 0
        })
      },
      ui: {
        label: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",
        listView: {
          initialColumns: ["username", "telegramId", "firstName", "lastName"]
        }
      }
    }),
    Product: (0, import_core.list)({
      access: import_access.allowAll,
      fields: {
        title: (0, import_fields.text)({ validation: { isRequired: true } }),
        content: (0, import_fields.text)(),
        image: (0, import_fields.image)({
          storage: "images"
        })
        // video: file({
        //   storage: 'videos',
        // }),
      },
      ui: {
        label: "\u0422\u043E\u0432\u0430\u0440\u044B",
        listView: {
          initialColumns: ["title", "content", "image"]
        }
      }
    })
  },
  ui: {
    isDisabled: false
  },
  // graphql: {
  //   playground: false,
  //   apolloConfig: {
  //     introspection: false,
  //   },
  // },
  server: {
    port: 3001,
    // cors: { 
    //   origin: true, 
    //   credentials: true,
    //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    //   allowedHeaders: ['Content-Type', 'Authorization'],
    // },
    extendExpressApp: (app) => {
      app.use(requireAuth);
    }
  }
});
//# sourceMappingURL=config.js.map
