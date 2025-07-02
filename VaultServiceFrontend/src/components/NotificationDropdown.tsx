
import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Popover,
  Button,
  useTheme,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationItem from './NotificationItem';

interface Notification {
  id: string;
  title: string;
  timestamp: string;
  isRead: boolean;
}

const NotificationDropdown: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Crypto Order for Coin USDT_BSC status has been updated by the admin',
      timestamp: 'April 15th 2025, 9:46:24 am',
      isRead: false,
    },
    {
      id: '2',
      title: 'Crypto Order for Coin USDT_BSC status has been updated by the admin',
      timestamp: 'April 11th 2025, 9:35:36 am',
      isRead: false,
    },
    {
      id: '3',
      title: 'Crypto Order for Coin ADA status has been updated by the admin',
      timestamp: 'April 11th 2025, 9:35:25 am',
      isRead: false,
    },
    {
      id: '4',
      title: 'System maintenance completed successfully',
      timestamp: 'April 8th 2025, 4:53:54 pm',
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[8],
            borderRadius: 2,
            width: {
              xs: '90vw',
              sm: '400px',
            },
            maxWidth: '400px',
            maxHeight: '500px',
          },
        }}
      >
        <Box>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  minWidth: 'auto',
                  p: 0.5,
                }}
              >
                View All
              </Button>
              <Button
                size="small"
                onClick={handleMarkAllRead}
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  minWidth: 'auto',
                  p: 0.5,
                }}
              >
                Mark All Read
              </Button>
            </Box>
          </Box>

          {/* Notifications List */}
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  title={notification.title}
                  timestamp={notification.timestamp}
                  isRead={notification.isRead}
                  onClick={() => handleNotificationClick(notification.id)}
                />
              ))
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  No notifications
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationDropdown;
