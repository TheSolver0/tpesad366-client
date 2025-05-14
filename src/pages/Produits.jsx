import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";

import '@ant-design/v5-patch-for-react-19';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Form, Input, InputNumber, Modal, Select, Popconfirm, message } from 'antd';
import {
    MinusSquareFilled,
    PlusSquareOutlined,
    EditFilled,
    QuestionCircleOutlined,
    CaretUpOutlined,
    CaretDownOutlined,

} from '@ant-design/icons';
import DataTable from 'datatables.net-dt';
import { getProduits } from "../services/api";
import { getCategories } from "../services/api";

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';

import axios from "axios";
import axiosInstance from '../services/axiosInstance';
// import api from '../services/axpi';


function AjouterProduit({ onProduitAdded }) {

    const [form] = Form.useForm();


    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories().then(setCategories);


        getCategories().catch(error => console.error("Erreur lors du chargement des produits :", error));
    }, [])



    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    const onFinish = async (values) => {
        const { nom, desc, categ, qte, pu, seuil } = values;
        console.log(values);

        try {
            const response = await axiosInstance.post('http://localhost:8000/produits/',{
                nom,
                desc,
                categ,
                qte,
                pu,
                seuil
            });

            message.success("Produit ajouté avec succès !");
            form.resetFields();
            onProduitAdded(response.data);

            console.log('Produit ajouté :', response.data);
        } catch (error) {
            message.error("Erreur lors de l’ajout du produit !");
            console.error('Erreur lors de l’ajout', error);
        }
    };





    return (<Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
        form={form}
    >
        <fieldset>
            <legend> <h5>Ajouter un produit</h5> </legend>
            <Form.Item name='nom' label="Nom" rules={[{ required: true }]} >
                <Input />
            </Form.Item>
            <Form.Item name='desc' label="Description" rules={[{ required: true }]} >
                <Input />
            </Form.Item>
            <Form.Item name='categ' label="Categorie" rules={[{ required: true }]}>
                <Select>
                    {categories.map((categorie) => (
                        <Select.Option key={categorie.id} value={categorie.id} >{categorie.libelle}</Select.Option>
                    ))}

                </Select>
            </Form.Item>
            <Form.Item name='qte' label="Quantité" rules={[{ type: 'number', min: 0, required: true }]}>
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name='pu' label="Prix unitaire" rules={[{ type: 'number', min: 0, required: true }]} >
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name='seuil' label="Seuil" rules={[{ type: 'number', min: 0, required: true }]} >
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit" >
                    Ajouter produit
                </Button>
            </Form.Item>
        </fieldset>

    </Form>
    );
}


export function Produits() {
    const [produits, setProduits] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
    useEffect(() => {
        // Charger les données une seule fois
        getProduits()
            .then(setProduits)
            .catch((error) => console.error("Erreur lors du chargement des produits :", error));
    }, []);
    useEffect(() => {
        produits.forEach(p => {
          if (p.qte <= p.seuil) {
            message.warning(`Produit #${p.id} a atteint le seuil`);
          }
        });
      }, [produits]);
    const columns = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Nom', accessorKey: 'nom' },
        { header: 'Description', accessorKey: 'desc' },
        { header: 'Categorie', accessorKey: 'categorie_nom' },
        { header: 'Stock', accessorKey: 'qte' },
        { header: 'Prix Unitaire', accessorKey: 'pu' },
        { header: 'Seuil', accessorKey: 'seuil' },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <Flex justify="space-evenly">
                    <Popconfirm
                        title="Suppression du client"
                        description="Êtes-vous sûr de vouloir supprimer ce client ?"
                        onConfirm={() => handleDelete(row.original.id)}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Button danger><MinusSquareFilled /></Button>
                    </Popconfirm>

                    <NavLink to={`/produit/${row.original.id}`}>
                        <Button><EditFilled /></Button>
                    </NavLink>
                </Flex>
            ),
        },
    ];
    const table = useReactTable({
        data: produits,
        columns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,  // première page
                pageSize: 5,   // tu ne verras que 3 entrées
            }
        },
    });

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {

        setOpen(false);
        setConfirmLoading(false);

    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const handleDelete = async (id) => {
        console.log('id', id);
        // console.log('id',id);
        try {
            const response = await axiosInstance.delete(`http://localhost:8000/produits/${id}/`);
            message.success('Produit supprimé');
            setProduits(prev => prev.filter(c => c.id !== id));


        } catch (error) {
            message.error("Erreur lors de la suppression du produit !");
            console.error('Erreur lors de la suppression', error);
        }
    };
    const cancel = e => {
        console.log(e);
        message.error('Click on No');
    };

    return (

        <>
            <h2 >Produits</h2>
           
            <Input
                placeholder="Rechercher..."
                value={globalFilter || ''}
                onChange={e => setGlobalFilter(e.target.value)}
                style={{ marginBottom: '1rem', width: '300px' }}
            />
            <Row justify="space-between">
                <Col span={14}>
                    <table id="myTable" className="table  table-hover table-striped-columns  align-middle">
                        <caption>Liste des Produits</caption>
                        <thead className="table-dark">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{ asc: <CaretUpOutlined />, desc: <CaretDownOutlined /> }[header.column.getIsSorted()] ?? null}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>

                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className={row.original.qte <= row.original.seuil ? 'table-danger' : ''}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        </tbody>
                    </table>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Précédent</Button>
                        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Suivant</Button>
                        <span>
                            Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                        </span>
                    </div>
                </Col>
                <Col span={8} style={{ marginTop: '-60px' }}>
                    <AjouterProduit onProduitAdded={(newProduit) => setProduits(prev => [...prev, newProduit])} />

                </Col>
            </Row>

        </>


    )
}