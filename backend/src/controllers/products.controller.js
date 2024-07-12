import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/test';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIwNzgwODM3LCJpYXQiOjE3MjA3ODA1MzcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjE3Nzc4N2Q2LTdmMGEtNDFhNy1iM2M1LTQ1MTYzZDQ2ZTAwYyIsInN1YiI6ImFuaWsucm95X2NzLmgyMUBnbGEuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJ4aWZ5LWVjb21tZXJjZSIsImNsaWVudElEIjoiMTc3Nzg3ZDYtN2YwYS00MWE3LWIzYzUtNDUxNjNkNDZlMDBjIiwiY2xpZW50U2VjcmV0IjoiWVZJeWlEaVNhVEh6RVR5RyIsIm93bmVyTmFtZSI6IkFuaWsgUm95Iiwib3duZXJFbWFpbCI6ImFuaWsucm95X2NzLmgyMUBnbGEuYWMuaW4iLCJyb2xsTm8iOiIyMTE1ODAwMDAzIn0.5-nSMyP5ablx00CQL0KkSuXx6SwZYIJWkiLoJdpYRyM';

const fetchProductsFromCompany = async (company, category, minPrice, maxPrice, top) => {
    try {
        const response = await axios.get(`${BASE_URL}/companies/${company}/categories/${category}/products`, {
            // http://20.244.56.144/test/companies/AMZ/categories/Phone/products?top=5&minPrice=1&maxPrice=40000
            params: {
                top,
                minPrice,
                maxPrice
            },
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching product data from ${company}:`, error);
        return [];
    }
};

const fetchProducts = async (category, minPrice, maxPrice, top) => {
    const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
    const requests = companies.map(company => fetchProductsFromCompany(company, category, minPrice, maxPrice, top));

    try {
        const responses = await Promise.all(requests);
        let products = [];
        responses.forEach(response => {
            products = products.concat(response);
        });
        return products;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return [];
    }
};

const sortProducts = (products, sortBy, sortOrder) => {
    return products.sort((a, b) => {
        if (sortOrder === 'asc') return a[sortBy] - b[sortBy];
        return b[sortBy] - a[sortBy];
    });
};

const getProductsByCategory = async (req, res) => {
    const { categoryname } = req.params;
    const { n = 10, page = 1, sortBy = 'price', sortOrder = 'asc', minPrice = 0, maxPrice = Infinity } = req.query;
    const limit = parseInt(n, 10);
    const offset = (page - 1) * limit;

    let products = await fetchProducts(categoryname, minPrice, maxPrice, limit);
    products = sortProducts(products, sortBy, sortOrder);
    products = products.slice(offset, offset + limit);

    products = products.map((product, index) => ({
        ...product,
        customId: `${categoryname}-${index + offset}`
    }));

    res.json(products);
};

const getProductById = async (req, res) => {
    const { categoryname, productid } = req.params;

    const products = await fetchProducts(categoryname);
    const product = products.find(p => `${categoryname}-${products.indexOf(p)}` === productid);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export {
    getProductsByCategory,
    getProductById
};
