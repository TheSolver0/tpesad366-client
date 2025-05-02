import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from "react-router-dom";
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Form, Input, InputNumber, Modal, Select, Popconfirm, message } from 'antd';
import {
    MinusSquareFilled,
    PlusSquareOutlined,
    EditFilled,
    CaretUpOutlined,
    CaretDownOutlined,
    QuestionCircleOutlined,


} from '@ant-design/icons';
import DataTable from 'datatables.net-dt';
import { getCommandesClient, getProduits, getClients } from "../services/api";

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';

import axios from "axios";
import {useCommandesReducer} from '../hooks/useCommandesReducer';


const { Content } = Layout;


function AjouterCommande({ onCommandeAdded }) {

    const [form] = Form.useForm();

    const [produits, setProduits] = useState([]);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        getProduits().then(setProduits);
        getProduits().catch(error => console.error("Erreur lors du chargement des produits :", error));
        getClients().then(setClients);
        getClients().catch(error => console.error("Erreur lors du chargement des clients :", error));
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
        
        const { qte, produit, userC } = values;
        const p = produits.find(p => p.id === produit)
        const userF = null;
        console.log(values);
        let client = userC
        console.log(p.seuil);
        try {
            if(qte<=p.seuil )
            {
                const response = await axios.post('http://localhost:8000/commandesClient/', {
                    produits : produit,
                    qte,
                    client,
    
                });
    
                message.success("Commande ajouté avec succès !");
                form.resetFields();
                setTimeout(() => {
                    onCommandeAdded(response.data);
                }, 1000);
    
                console.log('Commande ajouté :', response.data);
            }
            else
            {
                const quantiteDisponible = Math.max(qte - p.seuil, 0);
                if(quantiteDisponible === 0)
                {
                  message.error("Produit en rupture de stock");

                }
                else
                {
                    message.error("Il n'y a plus assez de ce produit en stock. Vous pouvez d'abord prendre  " + quantiteDisponible + " Et prendre le reste au rechargement de stock");

                }
                
            }
            
        } catch (error) {
            message.error("Erreur lors de l’ajout de la commande !");
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
            <legend> <h5>Ajouter une Commande</h5> </legend>
            <Form.Item name='produit' label="Produit" rules={[{ required: true }]}>
                <Select>
                    {produits.map((produit) => (
                        <Select.Option key={produit.id} value={produit.id} >{produit.nom}</Select.Option>
                    ))}

                </Select>
            </Form.Item>

            <Form.Item name='qte' label="Quantité" rules={[{ type: 'number', min: 1, required: true }]}>
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name='userC' label="User" rules={[{ required: true }]}>
                <Select>
                    {clients.map((client) => (
                        <Select.Option key={client.id} value={client.id} >{client.nom}</Select.Option>
                    ))}

                </Select>
            </Form.Item>



            <Form.Item label={null}>
                <Button type="primary" htmlType="submit" >
                    Ajouter Commande
                </Button>
            </Form.Item>
        </fieldset>

    </Form>
    );
}



export function CommandesClients() {
    const [commandes, setCommandes] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
    const previousLivreesRef = useRef([]);

    useEffect(() => {

        getCommandesClient().then(setCommandes);
        getCommandesClient().catch(error => console.error("Erreur lors du chargement des commandes :", error));


    }, [])
    useCommandesReducer(commandes);


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [size, setSize] = useState('large');

    const columns = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Produit', accessorKey: 'produit_nom' },
        { header: 'Quantité', accessorKey: 'qte' },
        { header: 'Commandeur', accessorKey: 'client_nom' },
        { header: 'Prix Unitaire(XAF)', accessorKey: 'produit_pu' },
        { header: 'Montant(XAF)', accessorKey: 'montant' },
        {
            header: 'Statut',
            id: 'statut',
            cell: ({ row }) => (<span className="badge " style={{
                fontSize: '12px',
                background: (row.original.statut === 'EN_ATTENTE') ? 'orange' :
                    (row.original.statut === 'PREPAREE') ? 'blue' :
                        (row.original.statut === 'EXPEDIEE') ? '#06d6a0' :
                            (row.original.statut === 'LIVREE') ? '#007f5f' :
                                (row.original.statut === 'ANNULEE') ? 'red' : ''
            }} >{row.original.statut}</span>)
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <Flex justify="space-evenly">
                    <Popconfirm
                        title="Suppression de commande"
                        description="Êtes-vous sûr de vouloir supprimer cette commande ?"
                        onConfirm={() => handleDelete(row.original.id)}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Button danger><MinusSquareFilled /></Button>
                    </Popconfirm>

                    <NavLink to={`/commandeclients/${row.original.id}`}>
                        <Button><EditFilled /></Button>
                    </NavLink>
                </Flex>
            ),
        },
    ];
    const table = useReactTable({
        data: commandes,
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
                pageSize: 3,   
            }
        },
    });
    const handleDelete = async (id) => {
        console.log('id', id);
        // console.log('id',id);
        try {
            const response = await axios.delete(`http://localhost:8000/commandesClient/${id}/`);
            message.success('Commande supprimé');
            setTimeout(() => {
                setCommandes(prev => prev.filter(c => c.id !== id));
            }, 1000)


        } catch (error) {
            message.error("Erreur lors de la suppression de la commande !");
            console.error('Erreur lors de la suppression', error);
        }
    };

    return (

        <>
            <Flex align="flex-end" justify="space-between" className='flexCardstat'>
                <h2>Table de Commandes des Clients</h2>
                {/* <Button color='#1677ff' variant="solid" icon={<PlusSquareOutlined />} size={size}>
                    Ajouter un produit
                </Button> */}
            </Flex>


            <Row justify="space-between">
                <Col span={14}>
                    <table id="myTable" className="table  table-hover table-striped-columns  align-middle">
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
                                <tr key={row.id}>
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
                    <AjouterCommande onCommandeAdded={(newCommande) => setCommandes(prev => [...prev, newCommande])} />

                </Col>
            </Row>

        </>



    )
}