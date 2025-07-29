import React from 'react';
import { Box, Typography, Chip, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface UserScopesProps {
  userScopes: string[];
}

const UserScope: React.FC<UserScopesProps> = ({ userScopes }) => {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        User Scopes
      </Typography>

      {userScopes && userScopes.length > 0 ? (
        <Grid container spacing={1}>
          {userScopes.map((scope, index) => (
            <Grid item key={index}>
              <Chip label={scope} sx={{ backgroundColor: theme.palette.primary.light, color: theme.palette.primary.contrastText }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          No additional information available
        </Typography>
      )}
    </Box>
  );
};

export default UserScope;
