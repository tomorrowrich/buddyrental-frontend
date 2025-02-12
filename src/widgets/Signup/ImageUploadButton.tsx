"use client";

import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload"; // Importing FileUploadIcon

export default function ImageUploadButton() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <Box
      sx={{
        width: 500,
        height: 500,
        borderRadius: "50%",
        backgroundColor: "#fdf7f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
      }}
      onClick={() => document.getElementById("image-upload")?.click()}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      {/* Show Uploaded Image or Upload Icon */}
      {selectedImage ? (
        <img
          src={selectedImage}
          alt="Uploaded"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      ) : (
        <IconButton sx={{ color: "#ff80b0" }}>
          <FileUploadIcon fontSize="large" style={{ fontSize: "80px" }} />{" "}
          {/* Using FileUploadIcon */}
        </IconButton>
      )}
    </Box>
  );
}
