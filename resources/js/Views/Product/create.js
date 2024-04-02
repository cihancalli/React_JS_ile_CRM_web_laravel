import { inject, observer } from 'mobx-react';
import React,{ useEffect,useState} from 'react';
import Layout from '../../Components/Layout/front.layout';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomInput from '../../Components/Form/CustomInput';
import Select from 'react-select';
import ImageUploader from 'react-images-upload';
import CKEditor from 'ckeditor4-react';
import swal from 'sweetalert';
import axios from 'axios';

const ProductCreate = (props) => {

    const [categories,setCategories] = useState([]);
    const [images,setImages] = useState([]);
    const [property,setProperty] = useState([]);

    useEffect(() => {
        axios.get(`/api/product/create`,{
            headers:{
                Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            setCategories(res.data.categories);
        })
            .catch(e => console.log(e));
    },[images])

    const handleSubmit = (values,{ resetForm,setSubmitting }) => {
        const data = new FormData();

        images.forEach((image_file) => {
            data.append('file[]',image_file);
        });

        data.append('categoryId',values.categoryId);
        data.append('productName',values.productName);
        data.append('modelCode',values.modelCode);
        data.append('barcode',values.barcode);
        data.append('brand',values.brand);
        data.append('tax',values.tax);
        data.append('stock',values.stock);
        data.append('sellingPrice',values.sellingPrice);
        data.append('buyingPrice',values.buyingPrice);
        data.append('productDescription',values.productDescription);
        data.append('property',JSON.stringify(property));

        const config = {
            headers:{
                'Accept':'application/json',
                'content-type':'multipart/form-data',
                'Authorization':'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }
        axios.post('/api/product',data,config)
            .then((res) => {
                if(res.data.success){
                    swal("Product Added");
                    resetForm({});
                    setImages([]);
                    setProperty([]);
                    setSubmitting(false);
                }
                else
                {
                    swal(res.data.message);
                    setSubmitting(true);
                }
            })
            .catch(e => { setSubmitting(true); console.log(e); });

    };

    const newProperty = () => {
        setProperty([...property,{ property:'',value:'' }]);
    }

    const removeProperty = (index) => {
        const OldProperty = property;
        OldProperty.splice(index,1);
        setProperty([...OldProperty]);
    };

    const changeTextInput = (event,index) => {
        console.log(property);
        console.log(event.target.value,index);
        property[index][event.target.name] = event.target.value;
        setProperty([...property]);
    };

    return (
        <Layout>
            <div className="mt-5">
                <div className="container">
                    <Formik
                        initialValues={{
                            categoryId: '',
                            productName: '',
                            modelCode: '',
                            barcode: '',
                            brand: '',
                            stock: '',
                            tax: '',
                            buyingPrice: '',
                            sellingPrice: '',
                            productDescription: '',
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={
                            Yup.object().shape({
                                categoryId:Yup.number().required('Category Selection is Required'),
                                productName:Yup.string().required('Product Name Required'),
                                modelCode:Yup.string().required('Product Model Code is Required'),
                                barcode:Yup.string().required('Product Barcode Required'),
                                brand:Yup.string().required('Product Brand Required'),
                                buyingPrice:Yup.number().required('Product Purchase Price is Required'),
                                sellingPrice:Yup.number().required('Product Sales Price is Required'),
                            })}
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
                                        <div className="form-group">
                                            <ImageUploader
                                                withIcon={true}
                                                buttonText='Choose images'
                                                onChange={(picturesFiles) => setImages(images.concat(picturesFiles))}
                                                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                                maxFileSize={5242880}
                                                withPreview={true}
                                            ></ImageUploader>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="inputCategory">Category</label>
                                            <Select
                                                onChange={(e) => setFieldValue('categoryId', e.id)}
                                                placeholder={"Select Product Category"}
                                                getOptionLabel={option => option.name}
                                                getOptionValue={option => option.id}
                                                options={categories}/>
                                        </div>
                                        {(errors.categoryId && touched.categoryId) && <p className="form-error">{errors.categoryId}</p>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Product Name"
                                            value={values.productName}
                                            handleChange={handleChange('productName')}
                                        />
                                        {(errors.productName && touched.productName) && <p className="form-error">{errors.productName}</p>}
                                    </div>

                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Model Code"
                                            value={values.modelCode}
                                            handleChange={handleChange('modelCode')}
                                        />
                                        {(errors.modelCode && touched.modelCode) && <p className="form-error">{errors.modelCode}</p>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Barcode"
                                            value={values.barcode}
                                            handleChange={handleChange('barcode')}
                                        />
                                        {(errors.barcode && touched.barcode) && <p className="form-error">{errors.barcode}</p>}
                                    </div>

                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Brand"
                                            value={values.brand}
                                            handleChange={handleChange('brand')}
                                        />
                                        {(errors.brand && touched.brand) && <p className="form-error">{errors.brand}</p>}
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
                                        {(errors.stock && touched.stock) && <p className="form-error">{errors.stock}</p>}
                                    </div>

                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Tax"
                                            type="number"
                                            value={values.tax}
                                            handleChange={handleChange('tax')}
                                        />
                                        {(errors.tax && touched.tax) && <p className="form-error">{errors.tax}</p>}
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
                                        {(errors.buyingPrice && touched.buyingPrice) && <p className="form-error">{errors.buyingPrice}</p>}
                                    </div>

                                    <div className="col-md-6">
                                        <CustomInput
                                            title="Seling Price"
                                            type="number"
                                            value={values.sellingPrice}
                                            handleChange={handleChange('sellingPrice')}
                                        />
                                        {(errors.sellingPrice && touched.sellingPrice) && <p className="form-error">{errors.sellingPrice}</p>}
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
                                    property.map((item,index) => (
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <label>Property Name:</label>
                                                    <input type="text"
                                                           className="form-control"
                                                           name="property"
                                                           onChange={(event) => changeTextInput(event,index)}
                                                           value={item.property}/>
                                                </div>
                                            </div>

                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <label>Property Value:</label>
                                                    <input type="text"
                                                           className="form-control"
                                                           name="value"
                                                           onChange={(event) => changeTextInput(event,index)}
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
                                                Add Product
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

export default inject("AuthStore")(observer(ProductCreate));
