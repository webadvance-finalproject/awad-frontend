import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { useStore } from '../../store'
import { addReviewMovie } from "../../service/UserService";
const ReviewList = ({ reviews, onAddReview, movieID }) => {
  const [open, setOpen] = useState(false);
  const user = useStore((state) => state.user);

  const [newReview, setNewReview] = useState({ title: "", content: "" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewReview({ content: "" });
    setOpen(false);
  };

  const handleSave = async () => {
    if (newReview.content) {
        const token = await user.getIdToken();
        const rs = await addReviewMovie({token: token, movieID: movieID, review: newReview.content});
        if(rs && rs.statusCode === 201 && rs.data){
            onAddReview({name: user.displayName, review: newReview.content});
        }
        handleClose();
    }
  };

  return (
    <>
      <Paper elevation={3} style={{ maxHeight: 300, overflowY: "auto", padding: 16 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Reviews</Typography>
          <Button variant="contained" sx={{  
            backgroundColor: '#033B2C',
            color: '#fff',
            textTransform: 'none',
            padding: '8px 16px',
            borderRadius: '50px',
            '&:hover': {
              backgroundColor: '#033B2C',
              opacity: 0.9,
            },
            '& .MuiSvgIcon-root': {
              fontSize: '20px',
              marginRight: '8px'
            }}} 
            size="small" disabled={!user} onClick={handleOpen}>
            Create Review
          </Button>
        </Box>
        <List>
          {reviews?.length > 0 ? (
            reviews?.map((review, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={review.name} secondary={review.review} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              We don't have any reviews. Would you like to write one?
            </Typography>
          )}
        </List>
      </Paper>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create a Review</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newReview.content}
            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewList;

// Example usage:

// <ReviewList reviews={reviews} onAddReview={handleAddReview} />
