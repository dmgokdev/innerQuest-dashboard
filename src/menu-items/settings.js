import { IconSettings } from '@tabler/icons-react';

const icons = { IconSettings };

const settings = {
  id: 'settings',
  type: 'group',
  children: [
    {
      id: 'settings-page',
      title: 'Settings',
      type: 'item',
      url: '/settings',
      icon: icons.IconSettings,
      breadcrumbs: false
    }
  ]
};

export default settings;