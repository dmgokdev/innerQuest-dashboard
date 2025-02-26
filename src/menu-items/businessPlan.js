import { IconBusinessplan } from '@tabler/icons-react';

const icons = { IconBusinessplan };

const order = {
  id: 'business',
  type: 'group',
  children: [
    {
      id: 'business-page',
      title: 'Business Plan',
      type: 'item',
      url: '/sample-page',
      icon: icons.IconBusinessplan,
      breadcrumbs: false
    }
  ]
};

export default order;
