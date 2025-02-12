import { Box, Skeleton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useState } from "react";

const images = [
  "https://picsum.photos/1920/1080?random=1",
  "https://picsum.photos/1920/1080?random=2",
  "https://picsum.photos/1920/1080?random=3",
];

export function LoginCarousel() {
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    new Array(images.length).fill(false),
  );

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
        waitForTransition: true,
        reverseDirection: false,
        stopOnLastSlide: false,
      }}
      id="swiper"
      loop={true}
      slidesPerView={1}
      style={{ flex: 1, width: "100%", height: "75vh", borderRadius: "16px" }}
    >
      {images.map((src, index) => (
        <SwiperSlide key={index}>
          {!imagesLoaded[index] && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              data-testid="mui-skeleton"
            />
          )}
          <Box
            component="img"
            data-testid="img"
            src={src}
            alt={`Slide ${index + 1}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: imagesLoaded[index] ? "block" : "none",
            }}
            onLoad={() => {
              const newLoadedState = [...imagesLoaded];
              newLoadedState[index] = true;
              setImagesLoaded(newLoadedState);
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
