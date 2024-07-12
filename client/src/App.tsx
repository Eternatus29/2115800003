import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Box,
} from '@mui/material';

const App: React.FC = () => {
  const [category, setCategory] = useState<string>('Phone');
  const [topN, setTopN] = useState<number>(5);
  const [minPrice, setMinPrice] = useState<number>(1);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/product/categories/${category}/products`, {
        params: {
          top: topN,
          minPrice: minPrice,
          maxPrice: maxPrice,
        },
      });

      console.log('API Response:', response.data);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Product Comparison
            </Typography>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select value={category} onChange={(e) => setCategory(e.target.value as string)}>
                  {['Phone', 'Computer', 'TV', 'Earphone', 'Tablet', 'Charger', 'Mouse', 'Keypad', 'Bluetooth', 'Pendrive', 'Remote', 'Speaker', 'Headset', 'Laptop', 'PC'].map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Min Price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Max Price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Top N Products"
                type="number"
                value={topN}
                onChange={(e) => setTopN(parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Fetch Products
              </Button>
            </form>
            {loading && (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
              </Box>
            )}
            {error && (
              <Typography variant="body2" color="error" align="center" mt={2}>
                {error}
              </Typography>
            )}
            {!loading && !error && products.length > 0 && (
              <Box mt={2}>
                <Typography variant="h6" component="div" gutterBottom>
                  Products
                </Typography>
                <Box>
                  {products.map((product) => (
                    <Card key={product.customId} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="body2">Name: {product.name}</Typography>
                        <Typography variant="body2">Company: {product.company}</Typography>
                        <Typography variant="body2">Category: {product.company}</Typography>
                        <Typography variant="body2">Price: ${product.price}</Typography>
                        <Typography variant="body2">Rating: {product.rating}</Typography>
                        <Typography variant="body2">Discount: {product.discount}%</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default App;
