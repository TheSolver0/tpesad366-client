import React, { useState, useEffect, } from 'react';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex , Form, Input, InputNumber, Modal, Select, Popconfirm, message} from 'antd';
import {
    MinusSquareFilled,
    PlusSquareOutlined,
    EditFilled,

} from '@ant-design/icons';
import DataTable from 'datatables.net-dt';
import { getClients } from "../services/api";

import axios from "axios";


const { Content } = Layout;


function AjouterClient() {

    const [form] = Form.useForm();

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
        const { nom, email, adresse, telephone } = values;
        console.log(values);
        
        try {
            const response = await axios.post('http://localhost:8000/clients/', {
                nom,
                email,
                adresse, 
                telephone,
            });
           
            message.success("Client Enregistré avec succès !");
            form.resetFields();
            console.log('Client enregistré :', response.data);
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
        <Form.Item name='email' label="E-mail" rules={[{ required: true }]} >
            <Input  />
        </Form.Item>
        <Form.Item name='adresse' label="Adresse" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name='telephone' label="Quantité" rules={[{ type: 'number', min: 0, required: true }]}>
            <InputNumber  style={{ width: "100%" }}/>
        </Form.Item>
        

        <Form.Item label={null}>
            <Button type="primary" htmlType="submit" >
                Enregistrer Client
            </Button>
        </Form.Item>
    </Form>
    );
}



export function Clients() {
    const [clients, setClients] = useState([]);
    useEffect(() => {
        getClients().then(setClients);

        setTimeout(() => {
            let table = new DataTable('#myTable', {
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/2.0.3/i18n/fr-FR.json',
                },
                retrieve: true,
            });
        }, 100);
        getClients().catch(error => console.error("Erreur lors du chargement des produits :", error));
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
                <h2>Table des Clients</h2>
                <Button color='#1677ff' variant="solid" icon={<PlusSquareOutlined />} size={size} onClick={showModal}>
                    Enregistrer un client
                </Button>
                {/* <Button onClick={() => message.success("Test de message")}>Tester message</Button> */}

                <Modal
                    title="Enregistrement de client"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    {/* <FormAjout /> */}
                    <AjouterClient />
                </Modal>
            </Flex>

            <table id="myTable">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Adresse</th>
                        <th>Telephone</th>
                        {/* <th>Pts</th> */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id}>
                            <td>#{client.id}</td>
                            <td>{client.nom}</td>
                            <td>{client.email}</td>
                            <td>{client.adresse}</td>
                            <td>{client.telephone}</td>
                            {/* <td>{client.pt}</td> */}
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