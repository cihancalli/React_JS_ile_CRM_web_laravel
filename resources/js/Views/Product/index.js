import React, {useEffect, useState} from "react";
import {inject, observer} from "mobx-react";
import Layout from "../../Components/Layout/front.layout";
import axios from "axios";
import DataTable from "react-data-table-component";
import SubHeaderComponent from "../../Components/Form/SubHeaderComponent";
import ExpandedComponent from "../../Components/Form/ExpandedComponent";
import swal from 'sweetalert';

const ProductIndex = (props) => {
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [filter, setFilter] = useState({
        filteredData: [],
        text: 'filterText',
        isFilter: false
    });
    useEffect(() => {
        //console.log(props.AuthStore.appState.user.access_token)
        axios.get(`/api/product`, {
            headers: {
                Authorization: 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        }).then((res) => {
            setData(res.data.data);
        }).catch(e => console.log(e));
    }, [refresh])

    const filterItem = (e) => {
        const filterText = e.target.value;
        if (filterText != '') {
            const filteredItems = data.filter(
                (item) => (
                    item.productName && item.productName.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.barcode && item.barcode.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.modelCode && item.modelCode.toLowerCase().includes(filterText.toLowerCase())
                )
            );
            setFilter({
                filteredData: filteredItems,
                text: filterText,
                isFilter: true
            })
        } else {
            setFilter({
                filteredData: [],
                text: 'filterText',
                isFilter: false
            })
        }
    };

    const deleteItem = (item) => {
        swal({
            title: 'Are you sure you want to delete?',
            text: 'Once deleted, data will not be restored',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        }).then((willDelete) => {
            if (willDelete) {
                axios.delete(`/api/product/${item.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + props.AuthStore.appState.user.access_token
                    }
                }).then((res) => {
                    if (res.data.success) {
                        setRefresh(true);
                    } else {
                        swal(res.data.message);
                    }
                }).catch(e => console.log(e));
            }
        })

    };

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <DataTable
                            columns={
                                [
                                    {
                                        name: 'Model Code',
                                        selector: 'modelCode',
                                        sortable: true
                                    },
                                    {
                                        name: 'Barcode',
                                        selector: 'barcode',
                                        sortable: true
                                    },
                                    {
                                        name: 'Product Name',
                                        selector: 'productName',
                                        sortable: true
                                    },
                                    {
                                        name: 'Stock',
                                        selector: 'stock',
                                        sortable: true
                                    },
                                    {
                                        name: 'Selling Price',
                                        selector: 'sellingPrice',
                                        sortable: true
                                    },
                                    {
                                        name: 'Edit',
                                        cell: (item) => <button onClick={() => props.history.push(({
                                            pathname: `/product/edit/${item.id}`
                                        }))} className="btn btn-primary">Edit</button>
                                    },
                                    {
                                        name: 'Delete',
                                        cell: (item) => <button onClick={() => deleteItem(item)}
                                                                className="btn btn-danger">Delete</button>,
                                        button: true
                                    },
                                ]
                            }
                            subHeader={true}
                            subHeaderComponent={<SubHeaderComponent filter={filterItem} action={{
                                class: 'btn btn-success',
                                uri: () => props.history.push('/product/create'),
                                title: 'Add New Product'
                            }}/>}
                            responsive={true}
                            hover={true}
                            fixedHeader
                            pagination
                            expandableRows
                            expandableRowsComponent={<ExpandedComponent/>}
                            data={(filter.isFilter) ? filter.filteredData : data}>

                        </DataTable>
                    </div>
                </div>
            </div>
        </Layout>
    )
};

export default inject("AuthStore")(observer(ProductIndex));
