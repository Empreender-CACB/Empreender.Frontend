import React from 'react';
import { Card } from '@/components/ui';

interface CardData {
  [key: string]: unknown
}

interface CTableCardsProps {
  data: CardData[];
  renderItem: any;
}

const CTableCards: React.FC<CTableCardsProps> = ({ data, renderItem }) => {

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>

      {data.map((item, index) => (        
        <Card
          bodyClass="h-full"
          key={index}
          clickable
          className="hover:shadow-lg transition duration-150 ease-in-out h"
        >
          {renderItem({data: item})}
        </Card>
      ))}
    </div>
  );
};

export default CTableCards;