import React, { ReactNode, useState } from 'react';

const Tooltip = ({
  content,
  children,
}: {
  content: string;
  children: ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to render content with newlines
  const renderContentWithNewlines = (content: string) => {
    // Split the content by newline characters and filter out empty strings
    const lines = content.split('\n').filter(line => line);
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="relative flex items-center">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}>
        {children}
      </div>
      {isVisible && (
        <div
          className="absolute bottom-full mb-2 w-10 px-3 py-1 bg-black text-white text-sm rounded-lg z-10"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: '150px',
            maxWidth: '450px',
          }}>
          {renderContentWithNewlines(content)}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
