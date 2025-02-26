// assets
import { IconKey, IconShoppingCart } from '@tabler/icons-react';

// constant
const icons = {
  IconKey,
  IconShoppingCart
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: '',
  caption: '',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Products',
      type: 'collapse',
      icon: icons.IconShoppingCart,

      children: [
        {
          id: 'products',
          title: 'Product',
          type: 'item',
          url: '/sample-page',
          target: true
        },
        {
          id: 'login3',
          title: 'Product Category',
          type: 'item',
          url: '/sample-page',
          target: true
        }
      ]
    }
  ]
};

export default pages;
