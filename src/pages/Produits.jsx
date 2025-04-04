import React, { useState, useEffect, } from 'react';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Form, Input, InputNumber, Modal, Select, Popconfirm } from 'antd';
import {
    MinusSquareFilled,
    PlusSquareOutlined,
    EditFilled,
    QuestionCircleOutlined, 

} from '@ant-design/icons';
import DataTable from 'datatables.net-dt';
import { getProduits } from "../services/api";

const { Content } = Layout;


const FormAjout = () => {
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
    const onFinish = values => {
        console.log(values);
    };

    return (<Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
    >
        <Form.Item name={['user', 'name']} label="Nom" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name={['user', 'description']} label="Description" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name={['user', 'cat']} label="Categorie" rules={[{ required: true }]}>
            <Select>
                <Select.Option value="c1">Categorie1</Select.Option>
                <Select.Option value="c2">Categorie2</Select.Option>
                <Select.Option value="c3">Categorie3</Select.Option>
                <Select.Option value="c4">Categorie4</Select.Option>
                <Select.Option value="c5">Categorie5</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item name={['user', 'stock']} label="Stock" rules={[{ type: 'number', min: 0, max: 99, required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name={['user', 'stock']} label="Prix unitaire" rules={[{ type: 'number', min: 0, required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name={['user', 'stock']} label="Seuil" rules={[{ type: 'number', min: 0, required: true }]}>
            <Input />
        </Form.Item>

        <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
                Ajouter produit
            </Button>
        </Form.Item>
    </Form>)
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
            });
        }, 200);

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
            }}
        >
            <Flex align="flex-end" justify="space-between" className='flexCardstat'>
                <h2 >Table de Produits</h2>
                <Button color='#1677ff' variant="solid" icon={<PlusSquareOutlined />} size={size} onClick={showModal}>
                    Ajouter un produit
                </Button>
                <Modal
                    title="Ajout de produit"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    <FormAjout />
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
                                        <Button danger title='Supprimer' style={{borderColor:"transparent"}}>
                                            <MinusSquareFilled className='text-danger' />
                                        </Button>
                                    </Popconfirm>

                                    <Button primary title='Supprimer' style={{borderColor:"transparent"}}>
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