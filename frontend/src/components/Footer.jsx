import { Box, Typography, Container, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: "auto",
        backgroundColor: "#004D40",
        color: "white",
        borderTop: "1px solid #00332c",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
          &copy; {new Date().getFullYear()} MangroveSight Teluk Balikpapan.
        </Typography>
        <Typography variant="body2" align="center" sx={{ opacity: 0.8, mt: 1 }}>
          Data disediakan oleh{" "}
          <Link
            href="https://www.globalmangrovewatch.org/"
            color="inherit"
            target="_blank"
            rel="noopener noreferrer"
          >
            Global Mangrove Watch
          </Link>
          .
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
