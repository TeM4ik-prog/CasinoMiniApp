import { config, list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { float, image, integer, text } from '@keystone-6/core/fields';
import auth from 'basic-auth';

const requireAuth = (req, res, next) => {
  const user = auth(req);

  if (
    user &&
    user.name === 'admin' &&
    user.pass === 'admin1111'
  ) {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Keystone"');
    res.status(401).send('Authentication required.');
  }
};

export default config({

  db: {
    provider: 'sqlite',
    // url: 'file:../backend/prisma/dev.db',
  },

  storage: {
    images: {
      kind: 'local',
      type: 'image',
      generateUrl: path => `/uploads/images/${path}`,
      serverRoute: {
        path: '/uploads/images',
      },
      storagePath: 'uploads/images',
    },

    videos: {
      kind: 'local',
      type: 'file',
      generateUrl: path => `/uploads/videos/${path}`,
      serverRoute: {
        path: '/uploads/videos',
      },
      storagePath: 'uploads/videos',
    },
  },

  lists: {

    User: list({
      access: allowAll,
      fields: {
        telegramId: integer({
          validation: { isRequired: true },
          isIndexed: 'unique',
          db: { isNullable: false },
        }),
        username: text({
          validation: { isRequired: true },
          db: { isNullable: false },
        }),
        lastName: text({
          db: { isNullable: true },
        }),
        firstName: text({
          db: { isNullable: true },
        }),
        photoUrl: text({
          db: { isNullable: true },
        }),

        balance: float({
          defaultValue: 0
        })
      },

      ui: {
        label: 'Пользователи',
        listView: {
          initialColumns: ['username', 'telegramId', 'firstName', 'lastName'],
        },
      },
    }),

    Product: list({
      access: allowAll,
      fields: {
        title: text({ validation: { isRequired: true } }),
        content: text(),
        image: image({
          storage: 'images',
        }),

        // video: file({
        //   storage: 'videos',
        // }),
      },

      ui: {
        label: 'Товары',
        listView: {
          initialColumns: ['title', 'content', 'image'],
        },
      }
    }),
  },


  ui: {
    isDisabled: false,
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
    },
  },
});
