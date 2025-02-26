import { IconPencilQuestion } from '@tabler/icons-react';

const icons = { IconPencilQuestion };

const question = {
  id: 'question',
  type: 'group',
  children: [
    {
      id: 'questions-page',
      title: 'Steps',
      type: 'item',
      url: '/steps',
      icon: icons.IconPencilQuestion,
      breadcrumbs: false
    }
  ]
};

export default question;
