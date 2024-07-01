import { useEffect, useState } from 'react';
import './css/Inventory.css';
import CardProduct from '../components/Modals/Product/CardProduct';
import { useDispatch } from 'react-redux';
import { allProducts } from '../store/slices/products.slice';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import getConfigAuth from '../utils/getConfigAuth';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

const InventoryPage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [isSearchProduct, setIsSearchProduct] = useState('');
    const dispatch = useDispatch();
    const [productsAPI, setProductsAPI] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        totalPages: 0
    });
    const [loading, setLoading] = useState(false); // Estado de carga

    const limit = 7; // cantidad de productos

    const fetchProducts = () => {
        setLoading(true); // Comienza la carga
        axios.get(`${apiUrl}/products/admin?page=${pagination.currentPage}&limit=${limit}`, getConfigAuth())
            .then(res => {
                const { total, currentPage, totalPages, products } = res.data;
                setPagination({ total, currentPage, totalPages });
                setProductsAPI(products);
                localStorage.setItem('everchic_stored_products', JSON.stringify(res.data));
                dispatch(allProducts(products));
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false); // Termina la carga
            });
    };

    useEffect(() => {
        fetchProducts();
    }, [pagination.currentPage]);

    const handleChangePage = (event, page) => {
        if (page > 0 && page <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: page }));
        } else {
            console.log("No se puede ir a una página negativa o fuera de rango");
        }
    };

    const handleAddProduct = () => {
        setLoading(true); // Comienza la carga
        navigate('/add_product');
    };

    return (
        <>
            <div className="inventory_page_container">
                <div className="inventory_page_controllers_user_container">
                    <p className='inventory_page_title'>Inventario</p>
                    <div className="inventory_page_controller_user">
                        <div className="inventory_page_controllers_search_container">
                            <input
                                type="text"
                                className='inventory_page_search_input'
                                placeholder='Ingrese nombre del producto.'
                                onChange={(e) => setIsSearchProduct(e.target.value)}
                            />
                            <i className='bx bx-search-alt inventory_page_search_button'></i>
                        </div>
                        <div className="inventory_page_controllers_add_contact_container">
                            <i className='bx bx-add-to-queue inventory_page_add' onClick={handleAddProduct}></i>
                        </div>
                    </div>
                </div>
                {
                    productsAPI.map(product => (
                        <div
                            className="inventory_page_product_container"
                            key={product.id}
                        >
                            <CardProduct product={product} fetchProducts={fetchProducts} />
                        </div>
                    ))
                }
            </div>
            <div className='inventory_page_control_pagination_container'>
                <Stack spacing={2}>
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.currentPage}
                        onChange={handleChangePage}
                        variant="outlined"
                        shape="rounded"
                    />
                </Stack>
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default InventoryPage;
