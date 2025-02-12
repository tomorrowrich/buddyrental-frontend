"use client";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Chip,
  Button,
  Rating,
  Card,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function BuddyDetails() {
  const user = {
    name: "Alexa Rawles",
    email: "alexarawles@gmail.com",
    location: "Bangkok, Thailand",
    avatar: "https://picsum.photos/200",
    description:
      "Hello I am Alexa, I am a friendly and talkative person Hello I am Alexa, I am a friendly and talkative person Hello I am Alexa, I am a friendly and talkative person Hello I am Alexa, I am a friendly and talkative person Hello I am Alexa, I am a friendly and talkative person Hello I am Alexa, I am a friendly and talkative person Hello I am Alexa, I am a friendly and talkative person Hello I am Alexa, I am a friendly and talkative person",
    priceRange: "500 - 1000 bath/day",
    interests: ["Music", "Travel", "Technology"],
    reviews: Array(5).fill({
      name: "John Doe",
      rating: 4,
      comment: "เฟรนด์ลี่ เยี่ยมชวนคุยสนุก พาไปเที่ยวได้",
    }),
  };

  return (
    <Container sx={{ py: 5 }}>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          p: 4,
          border: "1.5px solid #7C606B",
          position: "relative",
        }}
      >
        <Box
          sx={{
            color: "white",
            borderRadius: "15px 15px 0 0",
            outline: "1.5px solid #7C606B",
            width: "100%",
            height: "100px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <Typography
          variant="h4"
          fontWeight={600}
          color="secondary"
          sx={{
            position: "absolute",
            top: "40px",
            left: "20px",
            px: 2,
          }}
        >
          Details of buddy
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{ md: "1fr 1fr" }}
          gap={3}
          mt={12}
        >
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              textAlign: "center",
              boxShadow: "0px 10px 20px rgba(124, 96, 107, 0.5)",
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
            />
            <Typography variant="h6" fontWeight={600}>
              {user.name}
            </Typography>
            <Typography color="text.secondary" fontSize={14}>
              {user.email}
            </Typography>
            <Box mt={1} display="flex" justifyContent="center" gap={1}>
              {user.interests.map((interest, index) => (
                <Chip key={index} label={interest} variant="outlined" />
              ))}
            </Box>
            <Typography
              mt={1}
              color="text.secondary"
              fontSize={14}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              📍 {user.location}
            </Typography>
            <Typography mt={2} fontSize={14}>
              {user.description}
            </Typography>
            <Box
              sx={{
                mt: 2,
                pt: 1,
                pb: 1,
                pl: 2,
                pr: 2,
                outline: "1px solid #C46BAE",
                borderRadius: 20,
                display: "inline-block",
              }}
            >
              <Typography color="secondary">
                Pricing: {user.priceRange}
              </Typography>
            </Box>

            <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ChatIcon />}
              >
                Chat
              </Button>
              <Button variant="contained" color="tertiary">
                Book
              </Button>
            </Box>
          </Card>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: "0px 10px 20px rgba(124, 96, 107, 0.5)",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {"Check Alexa's Availabilityyyyy"}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Confirm Booking
            </Button>
          </Card>
        </Box>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            mt: 3,
            boxShadow: "0px 10px 20px rgba(124, 96, 107, 0.5)",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Review from customers!
          </Typography>
          {user.reviews.map((review, index) => (
            <Box key={index} display="flex" alignItems="center" gap={2} mt={2}>
              <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
              <Box>
                <Rating
                  value={review.rating}
                  readOnly
                  size="small"
                  icon={
                    <StarRoundedIcon
                      fontSize="inherit"
                      sx={{ color: "#EB7BC0" }}
                    />
                  }
                  emptyIcon={
                    <StarRoundedIcon
                      fontSize="inherit"
                      sx={{ color: "#C4C4C4" }}
                    />
                  }
                />

                <Typography fontSize={14}>{review.comment}</Typography>
                <Typography fontSize={12} color="text.secondary">
                  {review.name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Card>
      </Box>
    </Container>
  );
}
