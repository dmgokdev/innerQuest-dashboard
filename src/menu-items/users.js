// assets
import { IconBrandChrome, IconHelp, IconUser } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp, IconUser };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const user = {
  id: 'user',
  type: 'group',
  children: [
    {
      id: 'user-page',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: icons.IconUser,
      breadcrumbs: false
    }
  ]
};

export default user;
