import React, { useEffect, useState } from "react";
import './css/AddProductPage.css';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { addProductThunk, allCategoriesProductsThunk, allCollectionProductsThunk, allSizesProductsThunk, allSupplierProductsThunk } from "../store/slices/products.slice";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Checkbox, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Swal from "sweetalert2";

const AddProductPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const [tags, setTags] = useState([]);
  const [selectedImages, setSelectedImage] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  /* Estados Globales Redux*/
  const sizes = useSelector(state => state.products.sizesStore);
  const collections = useSelector(state => state.products.collectionsStore);
  const categories = useSelector(state => state.products.categoryProductStore);
  const suppliers = useSelector(state => state.products.suppliersStore);

  /* Hooks */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(allCategoriesProductsThunk());
    dispatch(allSizesProductsThunk());
    dispatch(allCollectionProductsThunk());
    dispatch(allSupplierProductsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (selectedImages && !imageFiles.includes(selectedImages)) {
      if (imageFiles.length > 0) {
        setSelectedImage(imageFiles[0]);
      } else {
        setSelectedImage(null);
      }
    }
  }, [imageFiles, selectedImages]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      if (imageFiles.length + files.length > 4) {
        alert('Puedes seleccionar un máximo de 4 imágenes en total.');
        return;
      }
      setImageFiles([...imageFiles, ...files]);
      if (!selectedImages) {
        setSelectedImage(files[0]);
      }
    }
  };

  const handleThumbnailClick = (index) => {
    if (index >= 0 && index < imageFiles.length) {
      setSelectedImage(imageFiles[index]);
      setSelectedImageIndex(index);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...imageFiles];
    updatedImages.splice(index, 1);
    setImageFiles(updatedImages);
    if (index === selectedImageIndex) {
      const nextImageIndex = index === updatedImages.length ? index - 1 : index;
      setSelectedImage(updatedImages[nextImageIndex]);
      setSelectedImageIndex(nextImageIndex);
    }
  };

  const handleTagsChange = (tags) => {
    setTags(tags);
  };


  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const onSubmit = async (data) => {
    try {
      const success = await dispatch(addProductThunk(data, tags, imageFiles));
      if (success) {
        setShowSuccessAlert(true);
        handleNavigate();
      } else {
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      setShowErrorAlert(true);
    }
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);

  };

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false);
  };

  const handleNavigate = () => {
    Swal.fire({
      title: 'Producto ingresado',
      text: 'El producto se ha agregado correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/inventory');
      }
    })
  };

  const handleNavigateExit = () => {
    navigate('/inventory');
  }

  return (
    <div className="add_product_page_container">
      <form className="add_product_page_form" onSubmit={handleSubmit(onSubmit)}>
        <div className='add_product_page_title_container'>
          <p className='add_product_page_title'>Agregar Producto</p>
        </div>

        <div className="add_product_page_image_container">
          {selectedImages && (
            <img
              src={URL.createObjectURL(selectedImages)}
              alt="Imagen seleccionada"
              className="add_product_page_image"
            />
          )}
        </div>

        <div className='add_product_page_images_load_container'>
          {imageFiles.map((image, index) => (
            <div key={index} className="add_product_page_images_img_container">
              <img
                src={URL.createObjectURL(image)}
                alt={`Miniatura ${index + 1}`}
                className={`add_product_page_images ${selectedImages === image && "add_product_page_images_border"}`}
                onClick={() => handleThumbnailClick(index)}
              />
              <div onClick={() => handleRemoveImage(index)}>
                <i className='bx bx-x add_product_page_icon_delete_image'></i>
              </div>
            </div>
          ))}
        </div>

        <Box sx={{ paddingTop: 1 }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <Input
              type="file"
              onChange={handleImageUpload}
              inputProps={{ accept: 'image/*', multiple: true }}
              style={{ display: 'none' }}
            />
          </Button>
          {
            imageFiles.length < 4 && (
              <Input
                type="file"
                onChange={handleImageUpload}
                inputProps={{ accept: 'image/*', multiple: true }}
                style={{ display: 'none' }}
                fullWidth
              />
            )
          }
        </Box>

        <Box style={{ margin: "15px 0px" }}>
          <TagsInput
            value={tags}
            onChange={handleTagsChange}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box style={{ flex: 0.8 }}>
            <TextField
              type="text"
              id="outlined-basic"
              label="sku"
              style={{ width: "95%" }}
              variant="outlined"
              error={!!errors.sku}
              helperText={errors.sku ? errors.sku.message : ''}
              className={`add_product_page_input ${errors.sku ? 'input-error' : ''}`}
              {...register('sku', { required: 'Este campo es obligatorio' })}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 0.2 }}>
            <label className="add_product_page_label_check" htmlFor="new_product">
              Ocultar:
            </label>
            <Checkbox
              {...register('deleted_at')}
              color="primary"
              defaultChecked={false}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 0.2 }}>
            <label className="add_product_page_label_check" htmlFor="new_product">
              Nuevo:
            </label>
            <Checkbox
              {...register('new_product')}
              color="primary"
              defaultChecked={false}
            />
          </Box>
        </Box>

        <Box style={{ marginTop: 20 }}>
          <TextField
            type="text"
            id="title"
            label="Nombre producto"
            variant="outlined"
            style={{ width: "100%" }}
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ''}
            className={`add_product_page_input ${errors.title ? 'input-error' : ''}`}
            {...register('title', { required: 'Este campo es obligatorio' })}
          />
        </Box>

        <Box style={{ marginTop: 20 }}>
          <FormControl style={{ display: "flex" }}>
            <TextField
              type="text"
              id="description"
              label="Descripcion"
              variant="outlined"
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : ''}
              className={`add_product_page_input ${errors.description ? 'input-error' : ''}`}
              {...register('description', { required: 'Este campo es obligatorio' })}
            />
          </FormControl>
        </Box>

        <Box style={{ display: "flex", marginTop: 20, gap: 10 }}>
          <FormControl style={{ flex: 1 }}>
            <TextField
              id="stock"
              type="number"
              label="Stock"
              inputProps={{ step: "1" }}
              error={!!errors.stock}
              helperText={errors.stock ? errors.stock.message : ''}
              {...register('stock', { 
                required: 'Este campo es obligatorio',
                pattern: {
                  value: /^\d+$/, // Expresión regular para validar números enteros positivos
                  message: 'Ingrese un número entero válido'
                }
              })}
            />
          </FormControl>

          <FormControl style={{ flex: 1 }}>
            <TextField
              id="weight"
              type="number"
              label="Peso"
              defaultValue='0.070'
              inputProps={{ step: "0.001" }}
              error={!!errors.weight}
              helperText={errors.weight ? errors.weight.message : ''}
              {...register('weight', { required: 'Este campo es obligatorio' })}
            />
          </FormControl>
        </Box>

        <Box style={{ display: "flex", marginTop: 20, gap: 10 }}>
          <FormControl style={{ flex: 1 }}>
            <TextField
              id="cost_price"
              type="number"
              label="Precio producción"
              inputProps={{ step: "0.01" }}
              error={!!errors.cost_price}
              helperText={errors.cost_price ? errors.cost_price.message : ''}
              {...register('cost_price', { required: 'Este campo es obligatorio' })}
            />
          </FormControl>

          <FormControl style={{ flex: 1 }}>
            <TextField
              id="sell_price"
              type="number"
              defaultValue='5.00'
              label="Precio de venta"
              inputProps={{ step: "0.01" }}
              error={!!errors.sell_price}
              helperText={errors.sell_price ? errors.sell_price.message : ''}
              {...register('sell_price', { required: 'Este campo es obligatorio' })}
            />
          </FormControl>
        </Box>

        <Box style={{ width: "100%", display: "flex", paddingTop: 20, gap: 10 }}>
          <FormControl style={{ flex: 1 }}>
            <InputLabel id="shipping-select-label">Talla</InputLabel>
            <Select
              id="sizeId"
              label="Talla"
              defaultValue=""
              {...register('sizeId', { required: 'Este campo es obligatorio' })}
            >
              {sizes?.map((size) => (
                <MenuItem key={size.id} value={size.id}>
                  {size.size}
                </MenuItem>
              ))}
            </Select>
            {errors.sizeId && (
              <FormHelperText error>{errors.sizeId.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl style={{ flex: 1 }}>
            <InputLabel id="shipping-select-label">Colección</InputLabel>
            <Select
              id="collectionId"
              label="Colección"
              defaultValue=""
              {...register('collectionId', { required: 'Este campo es obligatorio' })}
            >
              {collections?.map((collection) => (
                <MenuItem key={collection.id} value={collection.id}>
                  {collection.name}
                </MenuItem>
              ))}
            </Select>
            {errors.collectionId && (
              <FormHelperText error>{errors.collectionId.message}</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Box style={{ width: "100%", display: "flex", paddingTop: 20, gap: 10 }}>
          <FormControl style={{ flex: 1 }}>
            <InputLabel htmlFor="categoryId">Categoria:</InputLabel>
            <Select
              id="categoryId"
              label="Categoria"
              defaultValue=""
              className={`add_product_page_select ${errors.categoryId ? 'input-error' : ''}`}
              {...register('categoryId', { required: 'Este campo es obligatorio' })}
            >
              {categories?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && (
              <FormHelperText error>{errors.categoryId.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl style={{ flex: 1 }}>
            <InputLabel htmlFor="supplierId">Proveedor:</InputLabel>
            <Select
              id="supplierId"
              label="Proveedor"
              defaultValue=""
              className={`add_product_page_select ${errors.supplierId ? 'input-error' : ''}`}
              {...register('supplierId', { required: 'Este campo es obligatorio' })}
            >
              {suppliers?.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.company}
                </MenuItem>
              ))}
            </Select>
            {errors.supplierId && (
              <FormHelperText error>{errors.supplierId.message}</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            AGREGAR
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleNavigateExit}
          >
            SALIR
          </Button>
        </Box>
      </form>
      {/* Snackbar para mostrar alerta de éxito */}
      <Snackbar open={showSuccessAlert} autoHideDuration={6000} onClose={handleCloseSuccessAlert}>
        <Alert onClose={handleCloseSuccessAlert} severity="success" sx={{ width: '100%' }}>
          Producto agregado correctamente.
        </Alert>
      </Snackbar>

      {/* Snackbar para mostrar alerta de error */}
      <Snackbar open={showErrorAlert} autoHideDuration={6000} onClose={handleCloseErrorAlert}>
        <Alert onClose={handleCloseErrorAlert} severity="error" sx={{ width: '100%' }}>
          Error al agregar el producto. Inténtalo de nuevo más tarde.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddProductPage;
