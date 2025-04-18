import React, { useState, useEffect, } from 'react';
import { useParams, useLocation } from "react-router-dom";
import '@ant-design/v5-patch-for-react-19';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Form, Input, InputNumber, Modal, Select, Popconfirm, message } from 'antd';

import { getClient } from "../services/api";

import axios from "axios";

function ModifierClient({ data }) {
    const [form] = Form.useForm();
   
   

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            form.setFieldsValue({
                nom: data.nom,  
                email: data.email,
                adresse: data.adresse,
                telephone: data.telephone,
               
            });
        }
    }, [data, form]);
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
        try {
            const response = await axios.put(`http://localhost:8000/clients/${data.id}/`, values);
            message.success("Client modifié avec succès !");
            console.log('Client Modifié :', response.data);
        } catch (error) {
            message.error("Erreur lors de la modification du Client !");
            console.error('Erreur :', error);
        }
    };

    return (
        <Form
        {...layout}
            form={form}
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
        >
            <Form.Item name='nom' label="Nom" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name='email' label="Email" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name='adresse' label="Adresse" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name='telephone' label="Telephone" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Modifier Client
                </Button>
            </Form.Item>
        </Form>
    );
}

export function EditClient() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [size, setSize] = useState('large');
    const { id } = useParams();

    const [Client, setClient] = useState([]);
    
    console.log({id});
    useEffect(() => {
        getClient(id).then(setClient);
        getClient().catch(error => console.error("Erreur lors du chargement des Clients :", error));
    }, [])

    return (
        <>
            <h2>Editer un Client</h2>
            <Flex align="center" justify="center" className='flexCardstat'>

                <Row>
                    <Col span={24}>
                        <ModifierClient data={Client}/>
                    </Col>
                </Row>
            </Flex>



        </>
    )
}