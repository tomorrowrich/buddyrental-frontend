"use client";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
  Tooltip,
} from "@mui/material";
import { NotificationsNone, DoneAll } from "@mui/icons-material";
import { markAllAsRead } from "@/api/notification/api";
import { useAuth } from "@/context/auth/auth";

interface NotificationTrayProps {
  userId: string;
}

const NotificationTray: React.FC<NotificationTrayProps> = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { notifications } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all unread notifications as read
      markAllAsRead();
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  useEffect(() => {
    setUnreadCount(notifications?.filter((e) => !e.notification.read).length);
  }, [notifications]);

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <Box component="div">
      <Tooltip title="Notifications">
        <IconButton
          color="primary"
          onClick={handleClick}
          aria-describedby={id}
          size="large"
        >
          <Badge badgeContent={unreadCount} color="secondary">
            <NotificationsNone />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              border: "1px solid rgba(237, 164, 189, 0.8)",
              borderRadius: 3,
              boxShadow: "0px 5px 30px rgba(237, 164, 189, 0.8)",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.5,
            borderBottom: "1px solid rgba(124, 96, 107, 0.1)",
          }}
        >
          <Typography variant="h6" color="primary">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              startIcon={<DoneAll />}
              size="small"
              color="tertiary"
              onClick={handleMarkAllAsRead}
              sx={{ fontSize: "0.75rem" }}
            >
              Mark all as read
            </Button>
          )}
        </Box>

        {notifications?.length === 0 ? (
          <Typography sx={{ p: 2 }}>No notifications found.</Typography>
        ) : (
          <List sx={{ width: "100%", p: 0, maxHeight: 400, overflow: "auto" }}>
            {notifications?.map((e, index) => (
              <span key={e.notification.id}>
                <ListItem
                  alignItems="flex-start"
                  onClick={async () => {
                    await e.markAsRead();
                    if (e.notification.url) {
                      window.location.assign(e.notification.url);
                    }
                  }}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: e.notification.read
                      ? "transparent"
                      : "rgba(237, 164, 189, 0.15)",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: e.notification.read
                        ? "rgba(124, 96, 107, 0.08)"
                        : "rgba(237, 164, 189, 0.25)",
                    },
                    borderLeft: e.notification.read
                      ? "none"
                      : "3px solid rgba(237, 164, 189, 0.7)",
                    px: 2,
                    py: 1.2,
                  }}
                  component="span"
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        component="span"
                        sx={{ fontWeight: 600 }}
                      >
                        {e.notification.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            component="span"
                            sx={{ flex: 1 }}
                          >
                            {e.notification.body}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="quaternary.main"
                            component="span"
                            sx={{ ml: 2, whiteSpace: "nowrap" }}
                          >
                            {formatTime(e.notification.createdAt.toString())}
                          </Typography>
                        </Box>
                      </Typography>
                    }
                  />
                </ListItem>
                {index < notifications?.length - 1 && (
                  <Divider sx={{ margin: 0 }} />
                )}
              </span>
            ))}
          </List>
        )}
      </Popover>
    </Box>
  );
};

export default NotificationTray;
