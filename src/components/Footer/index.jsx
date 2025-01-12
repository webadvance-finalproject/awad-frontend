import { Box, Container, Typography, Stack } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 20,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[200],
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          {/* Logo hoặc tên website */}
          <Typography variant="h6" component="div">
            MovieMuse AI
          </Typography>

          {/* Copyright */}
          <Typography variant="body2" color="textSecondary" align="center">
            © {new Date().getFullYear()} MovieMuse AI. All rights reserved.
          </Typography>

        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
