import { objectType } from '@nexus/schema';

export const Autho0User = objectType({
  name: 'Autho0User',

  definition(t) {
    t.id('uuid', { description: 'the unique user ID' });

    t.string('sub');

    t.string('state');

    t.string('jwt');

    t.string('nickname', { nullable: true });

    t.string('name', { nullable: true });

    t.string('email');

    t.string('picture', { nullable: true });

    t.boolean('email_verified');
  },
});
