"use client";
import React, { useState, useEffect } from "react";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { NotificationsNone } from "@mui/icons-material";
import { markAsRead } from "@/api/notification/api";
import { useRouter } from "next/navigation";
import { Notification } from "@/api/notification/interface";
import { baseURL } from "@/api";

const mockFetchNotifications = async () => {
  return new Promise<{ notifications: Notification[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        notifications: [
          {
            userId: "2",
            notificationId: "1",
            title: "Emily wat",
            message: "Thanks for joining us.",
            status: "unread",
            createdAt: new Date().toISOString(),
          },
          {
            userId: "3",
            notificationId: "2",
            title: "Jane doe",
            message: "Check out our latest update.",
            status: "read",
            createdAt: new Date().toISOString(),
          },
          {
            userId: "1",
            notificationId: "3",
            title: "Cooked",
            message: "Don't forget about your upcoming event.",
            status: "unread",
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }, 1000);
  });
};

interface NotificationTrayProps {
  userId: string;
}

const NotificationTray: React.FC<NotificationTrayProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const loadNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await mockFetchNotifications();
      //   const response = await fetchNotifications({
      //     status: 'all',
      //     page: 1,
      //     limit: 10
      //   });

      if (response && response.notifications) {
        setNotifications(response.notifications);

        const unreadNotifications = response.notifications.filter(
          (notification) => notification.status === "unread",
        ).length;
        setUnreadCount(unreadNotifications);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      setError("Failed to load notifications");
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 60000);

    return () => clearInterval(interval);
  }, [userId]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === "unread") {
      try {
        await markAsRead(notification.notificationId);

        setNotifications(
          notifications.map((n) =>
            n.notificationId === notification.notificationId
              ? { ...n, status: "read" }
              : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    }

    router.push(`${baseURL}/chat`);
    handleClose();
  };

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
          color="inherit"
          onClick={handleClick}
          aria-describedby={id}
          size="large"
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNone sx={{ color: "primary.main" }} />
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
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : notifications.length === 0 ? (
          <Typography sx={{ p: 2 }}>No notifications found.</Typography>
        ) : (
          <List sx={{ width: "100%", p: 0 }}>
            {notifications.map((notification, index) => (
              <span key={notification.notificationId}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      notification.status === "unread"
                        ? "rgba(25, 118, 210, 0.08)"
                        : "inherit",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                    px: 2,
                    py: 1,
                  }}
                  component="span"
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        component="span"
                      >
                        {notification.title}
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
                            {notification.message}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            component="span"
                            sx={{ ml: 2, whiteSpace: "nowrap" }}
                          >
                            {formatTime(notification.createdAt)}
                          </Typography>
                        </Box>
                      </Typography>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </span>
            ))}
          </List>
        )}
      </Popover>
    </Box>
  );
};

export default NotificationTray;
