import React from 'react';
import Tag from './Tag';

interface TagActiveInactiveProps {
  isActive: boolean;
  trueText: string;
  falseText: string;
  customClassTrue?: string;
  customClassFalse?: string;
}

const TagTrueFalse: React.FC<TagActiveInactiveProps> = ({ isActive, trueText, falseText, customClassTrue, customClassFalse }) => {

  const statusMapping = isActive 
    ? { label: trueText, class: customClassTrue ?? 'bg-sky-800 mr-2 text-white text-center' } 
    : { label: falseText, class: customClassFalse ?? 'bg-orange-500 mr-2 text-white' };

  return (
    <Tag
      className={`border-0 rounded-md ltr:ml-2 rtl:mr-2 h-6 ${statusMapping.class}`}
    >
      {statusMapping.label}
    </Tag>
  );
};

export default TagTrueFalse;
