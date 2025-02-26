import { IconBusinessplan } from '@tabler/icons-react';

const icons = { IconBusinessplan };

const plans = {
  id: 'plans',
  type: 'group',
  children: [
    {
      id: 'plans-page',
      title: 'Plans',
      type: 'item',
      url: '/plans',
      icon: icons.IconBusinessplan,
      breadcrumbs: false
    }
  ]
};

export default plans;
