import React from 'react';

interface StructuredDataProps {
  data: object;
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const serialized = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      // react-doctor-disable-next-line react-doctor/no-danger -- JSON-LD: serialized object with `<` escaped, not user-controlled HTML
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
};

export default StructuredData;
