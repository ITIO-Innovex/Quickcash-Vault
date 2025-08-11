import React from 'react';
import { useTheme } from '@mui/material';

type CustomNoteProps = {
  note?: boolean;
  children: React.ReactNode; // Jo text dikhana hai wo yahan pass karo
};

const CustomNoteBox: React.FC<CustomNoteProps> = ({ note = true, children }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const noteBorderColor = isDark ? '#fff' : '#FFD600';
  const noteBgColor = isDark ? '#332600' : '#FFF9C4';
  const noteTextColor = isDark ? '#fff' : '#444';

  return (
    <div
      style={{
        border: `2px solid ${noteBorderColor}`,
        background: noteBgColor,
        color: noteTextColor,
        borderRadius: '10px',
        padding: '16px',
        fontWeight: 500,
        fontSize: '1rem',
        margin: '8px 0',
      }}
    >
      {children}
    </div>
  );
};

export default CustomNoteBox;
