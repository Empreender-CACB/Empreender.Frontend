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
      label: customLabelTrue ?? 'Ativo',
      class: customClassTrue ?? 'bg-sky-800 mr-2 text-white text-center',
    },
    Inativo: {
      label: customLabelFalse ?? 'Inativo',
      class: customClassFalse ?? 'bg-orange-500 mr-2 text-white',
    },
  };

  const status = isAtivo ? 'Ativo' : 'Inativo';

  return (
    <Tag
      className={`border-0 rounded-md ltr:ml-2 rtl:mr-2 h-6 ${
        statusMapping[status].class || ''
      }`}
    >
      {statusMapping[status].label || ''}
    </Tag>
  );
};

export default TagActiveInative;