import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from '@mui/material';
import { Star } from '@mui/icons-material';

const OrderItemCard = ({ item }) => {
  return (
    <Card 
      elevation={1}
      sx={{ 
        bgcolor: 'white',
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Product Image */}
          <Box
            component="img"
            sx={{
              width: { xs: 80, sm: 120 },
              height: { xs: 80, sm: 120 },
              objectFit: 'cover',
              borderRadius: 1.5,
              flexShrink: 0
            }}
            src={item.image}
            alt={item.name}
          />

          {/* Product Details */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  mb: 1,
                  lineHeight: 1.3,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                {item.name}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Color: {item.color}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Size: {item.size}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Chip
                  label={`Seller: ${item.seller}`}
                  variant="filled"
                  size="small"
                  sx={{ 
                    bgcolor: '#e3f2fd',
                    color: '#1976d2',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                />
              </Box>

              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                ₹{item.price.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Rate & Review Button */}
          <Box sx={{ 
            display: 'flex',
            alignItems: 'flex-start',
            ml: { sm: 2 }
          }}>
            <Button
              variant="text"
              startIcon={<Star />}
              sx={{
                color: '#7c3aed',
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'rgba(124, 58, 237, 0.04)',
                }
              }}
            >
              Rate & Review Product
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderItemCard;