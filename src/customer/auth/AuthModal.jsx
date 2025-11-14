import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

const AuthModal = ({ handleClose, open, form = "login", onSwitch }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      BackdropProps={{
        timeout: 500,
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "relative",
            width: 480,
            maxWidth: "95vw",
            maxHeight: "95vh",
            overflowY: "auto",
            bgcolor: "rgba(255, 255, 255, 0.98)",
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            p: 5,
            outline: "none",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            // Smooth scrollbar
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              },
            },
          }}
        >
          {/* Close Button with Hover Effect */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "#6b7280",
              backgroundColor: "#f3f4f6",
              width: 36,
              height: 36,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "#e5e7eb",
                color: "#374151",
                transform: "rotate(90deg) scale(1.1)",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* Form Content */}
          {form === "login" ? (
            <LoginForm onSwitch={() => onSwitch && onSwitch("register")} handleClose={handleClose} />
          ) : (
            <RegisterForm onSwitch={() => onSwitch && onSwitch("login")} handleClose={handleClose}/>
          )}
        </Box>
      </Slide>
    </Modal>
  );
};

export default AuthModal;