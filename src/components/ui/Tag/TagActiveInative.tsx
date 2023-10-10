import React from 'react';
import Tag from './Tag';

interface TagActiveInativeProps {
  value: string;
  activeText: string;
}

const TagActiveInative: React.FC<TagActiveInativeProps> = ({ value, activeText }) => {
  const isAtivo = value === activeText;

  const statusMapping: Record<string, { label: string; class: string }> = {
    Ativo: {
      label: 'Ativa',
      class: 'bg-green-600 mr-2 text-white text-center',
    },
    Inativo: {
      label: 'Inativa',
      class: 'bg-yellow-300 mr-2 text-black',
    },
  };

  const status = isAtivo ? 'Ativo' : 'Inativo';

  return (
    <Tag
      className={`border-0 rounded-md ltr:ml-2 rtl:mr-2 ${
        statusMapping[status].class || ''
      }`}
    >
      {statusMapping[status].label || ''}
    </Tag>
  );
};

export default TagActiveInative;