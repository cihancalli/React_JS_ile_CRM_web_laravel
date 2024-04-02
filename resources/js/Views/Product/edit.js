import {inject, observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import Layout from '../../Components/Layout/front.layout';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CustomInput from '../../Components/Form/CustomInput';
import Select from 'react-select';
import ImageUploader from 'react-images-upload';
import CKEditor from 'ckeditor4-react';
import swal from 'sweetalert';
import axios from 'axios';
import {difference} from 'lodash';

const ProductEdit = (props) => {
    const {params} = props.match;
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [property, setProperty] = useState([]);
    const [product, setProduct] = useState({});
    const [newImages, setNewImages] = useState([]);
    const [defaultImages, setDefaultImages] = useState([]);

    useEffect(() => {
        axios.get(`/api/product/${params.id}/edit `, {
            headers: {
                Authorization: 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            if (res.data.success) {
                setCategories(res.data.categories);
                setProduct(res.data.product);
                setImages(res.data.product.images);
                setProperty(res.data.product.property);
                res.data.product.images.filter(x => !x.isRemove).map((item) => {
                    defaultImages.push(item.path)
                });
                setLoading(false);
            } else {
                swal(res.data.message);
            }
        })
            .catch(e => console.log(e));
    }, []);


    const handleSubmit = (values, {resetForm, setSubmitting}) => {
        const data = new FormData();
        newImages.forEach((image_file) => {

            data.append('newFile[]', image_file);
        });

        data.append('file', JSON.stringify(images));
        data.append('categoryId', values.categoryId);
        data.append('productName', values.productName);
        data.append('modelCode', values.modelCode);
        data.append('barcode', values.barcode);
        data.append('brand', values.brand);
        data.append('tax', values.tax);
        data.append('stock', values.stock);
        data.append('sellingPrice', values.sellingPrice);
        data.append('buyingPrice', values.buyingPrice);
        data.append('productDescription', values.productDescription);
        data.append('property', JSON.stringify(property));
        data.append('_method', 'put')

        const config = {
            headers: {
                'Accept': 'application/json',
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        }
        axios.post(`/api/product/${product.id}`, data, config)
            .then((res) => {
                if (res.data.success) {
                    setSubmitting(false);
                    swal(res.data.message);
                } else {
                    swal(res.data.message);
                    setSubmitting(false);
                }
            })
            .catch(e => console.log(e));

    };

    const newProperty = () => {
        setProperty([...property, {property: '', value: ''}]);
    }

    const removeProperty = (index) => {
        const OldProperty = property;
        OldProperty.splice(index, 1);
        setProperty([...OldProperty]);
    };

    const changeTextInput = (event, index) => {
        console.log(property);
        console.log(event.target.value, index);
        property[index][event.target.name] = event.target.value;
        setProperty([...property]);
    };

    const onChange = (picturesImage, pictures) => {
        if (picturesImage.length > 0) {
            setNewImages(newImages.concat(picturesImage))
        }
        const difference = defaultImages.filter(x => !pictures.includes(x));
        difference.map((item) => {
            const findIndex = defaultImages.findIndex((picture) => picture == item)
            if (findIndex != -1) {
                const findIndexImage = images.findIndex((image) => image.path == item);
                console.log(findIndexImage);
                images[findIndexImage]['isRemove'] = true;
                setImages([...images]);

            }
        });


    };

    if (loading) return <div>Loading...</div>


    return (
        <Layout>
            <div className="mt-5">
                <div className="container">
                    <Formik
                        initialValues={{
                            categoryId: product.categoryId,
                            productName: product.productName,
                            modelCode: product.modelCode,
                            barcode: product.barcode,
                            brand: product.brand,
                            stock: product.stock,
                            tax: product.tax,
                            buyingPrice: product.buyingPrice,
                            sellingPrice: product.sellingPrice,
                            productDescription: product.productDescription,
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={
                            Yup.object().shape({
                                categoryId: Yup.number().required('Category Selection is Required'),
                                productName: Yup.string().required('Product Name Required'),
                                modelCode: Yup.string().required('Product Model Code is Required'),
                                barcode: Yup.string().required('Product Barcode Required'),
                                brand: Yup.string().required('Product Brand Required'),
                                buyingPrice: Yup.number().required('Product Purchase Price is Required'),
                                sellingPrice: Yup.number().required('Product Sales Price is Required'),
                            })
                        }
                    >
                        {({
                              values,
                              handleChange,
                              handleSubmit,
                              handleBlur,
                              errors,
                              isValid,
                              isSubmitting,
                              setFieldValue,
                              touched
                          }) => (
                            <div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <ImageUploader
                                            withIcon={true}
                                            defaultImages={defaultImages}
                                            buttonText='Choose images'
                                            onChange={(picturesFiles, pictures) => onChange(picturesFiles, pictures)}
                                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                            maxFileSize={5242880}
                                            withPreview={true}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="inputCategory">Category</label>
                                            <Select
                                                value={categories.find(item => item.id == values.categoryId)}
                                                onChange={(e) => setFieldValue('categoryId', e.id)}
                                                placeholder={"Select Product Category"}
                                                getOptionLabel={option => option.name}
                                                getOptionValue={option => option.id}
                                                options={categories}/>

                                        </div>
                                        {(errors.categoryId && touched.categoryId) &&
                                            <p className="form-error">{errors.categoryId}</p>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Produc tName"
                                            value={values.productName}
                                            handleChange={handleChange('productName')}
                                        />
                                        {(errors.productName && touched.productName) &&
                                            <p className="form-error">{errors.productName}</p>}
                                    </div>
                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Model Code"
                                            value={values.modelCode}
                                            handleChange={handleChange('modelCode')}
                                        />
                                        {(errors.modelCode && touched.modelCode) &&
                                            <p className="form-error">{errors.modelCode}</p>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Barcode"
                                            value={values.barcode}
                                            handleChange={handleChange('barcode')}
                                        />
                                        {(errors.barcode && touched.barcode) &&
                                            <p className="form-error">{errors.barcode}</p>}
                                    </div>
                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Brand"
                                            value={values.brand}
                                            handleChange={handleChange('brand')}
                                        />
                                        {(errors.brand && touched.brand) &&
                                            <p className="form-error">{errors.brand}</p>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Stock"
                                            type="number"
                                            value={values.stock}
                                            handleChange={handleChange('stock')}
                                        />
                                        {(errors.stock && touched.stock) &&
                                            <p className="form-error">{errors.stock}</p>}
                                    </div>
                                    <div className="col-md-6">
                                        <CustomInput
                                            title="TAX"
                                            value={values.tax}
                                            handleChange={handleChange('tax')}
                                        />
                                        {(errors.tax && touched.tax) && <p>{errors.tax}</p>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Buying Price"
                                            type="number"
                                            value={values.buyingPrice}
                                            handleChange={handleChange('buyingPrice')}
                                        />
                                        {(errors.buyingPrice && touched.buyingPrice) &&
                                            <p className="form-error">{errors.buyingPrice}</p>}
                                    </div>
                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Selling Price"
                                            type="number"
                                            value={values.sellingPrice}
                                            handleChange={handleChange('sellingPrice')}
                                        />
                                        {(errors.sellingPrice && touched.sellingPrice) &&
                                            <p className="form-error">{errors.sellingPrice}</p>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="inputCKEditor">Product Description</label>
                                            <CKEditor
                                                data={values.productDescription}
                                                onChange={(event) => {
                                                    const data = event.editor.getData();
                                                    setFieldValue('productDescription', data);
                                                }}>
                                            </CKEditor>
                                        </div>
                                        {(errors.productDescription && touched.productDescription) &&
                                            <p className="form-error">{errors.productDescription}</p>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <button type="button" onClick={newProperty} className="btn btn-primary">New
                                                Property
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {
                                    property.map((item, index) => (
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <label>Property Name:</label>
                                                    <input type="text"
                                                           className="form-control"
                                                           name="property"
                                                           onChange={(event) => changeTextInput(event, index)}
                                                           value={item.property}/>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Property Value:</label>
                                                    <input type="text"
                                                           className="form-control"
                                                           name="value"
                                                           onChange={(event) => changeTextInput(event, index)}
                                                           value={item.value}/>
                                                </div>
                                            </div>

                                            <div className="col-md-1" style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'flex-end'
                                            }}>
                                                <div className="form-group">
                                                    <button onClick={() => removeProperty(index)}
                                                            type="button" className="btn btn-danger">X
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    ))
                                }

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <button
                                                disabled={!isValid || isSubmitting}
                                                onClick={handleSubmit}
                                                className="btn btn-secondary w-100 py-2 mb-5"
                                                type="button">
                                                Edit Product
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </Formik>
                </div>
            </div>
        </Layout>
    )
};
export default inject("AuthStore")(observer(ProductEdit));
