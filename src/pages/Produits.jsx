import React, { useState, useEffect, } from 'react';
import '@ant-design/v5-patch-for-react-19';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Form, Input, InputNumber, Modal, Select, Popconfirm, message } from 'antd';
import {
    MinusSquareFilled,
    PlusSquareOutlined,
    EditFilled,
    QuestionCircleOutlined,

} from '@ant-design/icons';
import DataTable from 'datatables.net-dt';
import { getProduits } from "../services/api";
import { getCategories } from "../services/api";

import axios from "axios";


const { Content } = Layout;


function AjouterProduit() {

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
    const onFinish =async (values) => {
        const { nom, desc, categ, qte, pu, seuil } = values;
        console.log(values);
        
        try {
            const response = await axios.post('http://localhost:8000/produits/', {
                nom,
                desc,
                categ, 
                qte,
                pu,
                seuil
            });
           
            message.success("Produit ajouté avec succès !");
            form.resetFields();
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
        <Form.Item name='nom' label="Nom" rules={[{ required: true }]} >
            <Input />
        </Form.Item>
        <Form.Item name='desc' label="Description" rules={[{ required: true }]} >
            <Input  />
        </Form.Item>
        <Form.Item name='categ' label="Categorie" rules={[{ required: true }]}>
            <Select>
                {categories.map((categorie) => (
                    <Select.Option key={categorie.id} value={categorie.id} >{categorie.libelle}</Select.Option>
                ))}

            </Select>
        </Form.Item>
        <Form.Item name='qte' label="Quantité" rules={[{ type: 'number', min: 0, required: true }]}>
            <InputNumber  style={{ width: "100%" }}/>
        </Form.Item>
        <Form.Item name='pu' label="Prix unitaire" rules={[{ type: 'number', min: 0, required: true }]} >
            <InputNumber  style={{ width: "100%" }}/>
        </Form.Item>
        <Form.Item name='seuil' label="Seuil" rules={[{ type: 'number', min: 0, required: true }]} >
            <InputNumber  style={{ width: "100%" }}/>
        </Form.Item>

        <Form.Item label={null}>
            <Button type="primary" htmlType="submit" >
                Ajouter produit
            </Button>
        </Form.Item>
    </Form>
    );
}






export function Produits() {
    const [produits, setProduits] = useState([]);

    useEffect(() => {
        getProduits().then(setProduits);

        setTimeout(() => {
            let table = new DataTable('#myTable', {
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/2.0.3/i18n/fr-FR.json',
                },
                retrieve: true,
                "paging": true,            // Active la pagination
                "pageLength": 5,          // Nombre d'éléments par page
                "lengthMenu": [5, 10, 25, 50], // Options de pagination (5, 10, 25, 50)
                "pagingType": "full_numbers" ,
            });
        }, 100);

        getProduits().catch(error => console.error("Erreur lors du chargement des produits :", error));
    }, [])




    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [size, setSize] = useState('large');

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (

        <Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                overflowY: 'scroll',
            }}
        >
            <Flex align="flex-end" justify="space-between" className='flexCardstat'>
                <h2 >Table de Produits</h2>
                <Button color='#1677ff' variant="solid" icon={<PlusSquareOutlined />} size={size} onClick={showModal}>
                    Ajouter un produit
                </Button>
                {/* <Button onClick={() => message.success("Test de message")}>Tester message</Button> */}

                <Modal
                    title="Ajout de produit"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    {/* <FormAjout /> */}
                    <AjouterProduit />
                </Modal>

            </Flex>

            <table id="myTable">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Catégorie</th>
                        <th>Stock</th>
                        <th>Prix Unitaire(XAF)</th>
                        <th>Seuil</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {produits.map((produit) => (
                        <tr key={produit.id}>
                            <td>#{produit.id}</td>
                            <td>{produit.nom}</td>
                            <td>{produit.desc}</td>
                            <td>{produit.categorie_nom}</td>
                            <td>{produit.qte}</td>
                            <td>{produit.pu} </td>
                            <td>{produit.seuil} </td>
                            <td>
                                <Flex align="flex-end" justify="space-evenly" >

                                    <Popconfirm
                                        title="Suppression de produit"
                                        description="Etes vous sure de vouloir supprimer ce produit?"
                                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                    >
                                        <Button danger title='Supprimer' style={{ borderColor: "transparent" }}>
                                            <MinusSquareFilled className='text-danger' />
                                        </Button>
                                    </Popconfirm>

                                    <Button primary title='Supprimer' style={{ borderColor: "transparent" }}>
                                        <EditFilled className='text-primary' />
                                    </Button>
                                </Flex>
                            </td>
                        </tr>
                    ))}
                    {/* <tr>
                        <td>#2</td>
                        <td>Produit 2</td>
                        <td>Description Produit 2</td>
                        <td>Catégorie 2</td>
                        <td>80</td>
                        <td>8200 </td>
                        <td>7 </td>
                        <td>
                            <Flex align="flex-end" justify="space-evenly" >
                                <a title='Supprimer' >
                                    <MinusSquareFilled className='text-danger' />
                                </a>

                                <a title='Editer' >
                                    <EditFilled className='text-primary' />
                                </a>
                            </Flex>
                        </td>
                    </tr> */}
                </tbody>
            </table>
        </Content>



    )
}