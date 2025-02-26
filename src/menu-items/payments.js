import { IconShoppingBag } from '@tabler/icons-react';

const icons = { IconShoppingBag };

const order = {
  id: 'payment',
  type: 'group',
  children: [
    {
      id: 'payment-page',
      title: 'Payments',
      type: 'item',
      url: '/payments',
      icon: icons.IconShoppingBag,
      breadcrumbs: false
    }
  ]
};

export default order;
