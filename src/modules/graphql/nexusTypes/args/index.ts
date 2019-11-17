import { inputObjectType } from 'nexus';

export const SettingUpdate = inputObjectType({
  name: 'SettingUpdate',
  definition(t) {
    t.string('key', { required: true });
    t.string('value', { required: true });
    t.field('type', {
      type: 'SettingsType',
      required: true,
    });
  },
});

export const OrganisationSettingsUpdate = inputObjectType({
  name: 'OrganisationSettingsUpdate',
  definition(t) {
    t.string('billingAddress');
    t.string('phoneNumber');
    t.string('taxNumber');
  },
});
