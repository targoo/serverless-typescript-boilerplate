import { objectType } from 'nexus';

export const Autho0User = objectType({
  name: 'Autho0User',
  definition(t) {
    t.id('uuid', { description: 'UUID of the user (Auth0 Sub)' });

    t.string('jwt');

    t.string('nickname', { nullable: true });

    t.string('name', { nullable: true });

    t.string('email', { nullable: true });

    t.string('picture', { nullable: true });

    t.boolean('email_verified', { nullable: true });
  },
});
