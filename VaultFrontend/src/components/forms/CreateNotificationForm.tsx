import ReactQuill from 'react-quill';
import React, { useState } from 'react';
import CustomButton from '../CustomButton';
import 'react-quill/dist/quill.snow.css';
import CustomInput from '@/components/CustomInputField';
import { Box, Divider, Typography, useTheme } from '@mui/material';

interface Props {
  onClose: () => void;
}

const CreateNotificationForm: React.FC<Props> = ({ onClose }) => {
  const theme = useTheme();
  const [user, setUser] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    const data = { user, title, tags, image, content };
    console.log('Submitted:', data);
    onClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* User Field */}
        <CustomInput label="User(Optional)" value={user} onChange={(e) => setUser(e.target.value)} fullWidth />

      {/* Title Field */}
        <CustomInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />

      {/* Tags Field */}
        <CustomInput label="tags"  value={tags} onChange={(e) => setTags(e.target.value)} fullWidth />

      {/* Image Upload */}
        <Typography variant="subtitle2" sx={{color:theme.palette.text.primary}}>Upload Image</Typography>
        <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />

      {/* CKEditor for Content */}
      <Box>
        <Typography variant="subtitle2" sx={{color:theme.palette.text.primary}}>Content</Typography>
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        <Divider sx={{ mt: 1 }} />
      </Box>

      {/* Buttons */}
      <Box sx={{ }}>
        <CustomButton onClick={onClose}>Close</CustomButton>
      </Box>
    </Box>
  );
};

export default CreateNotificationForm;
