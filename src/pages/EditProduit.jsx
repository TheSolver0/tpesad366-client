import React, { useState, useEffect, } from 'react';
import { useParams, useLocation } from "react-router-dom";
import '@ant-design/v5-patch-for-react-19';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Form, Input, InputNumber, Modal, Select, Popconfirm, message } from 'antd';

import { getProduit } from "../services/api";
import { getCategories } from "../services/api";

import axios from "axios";
import axiosInstance from '../services/axiosInstance';



function ModifierProduit({ data }) {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Charger les catégories
        getCategories()
            .then(setCategories)
            .catch(error => console.error("Erreur chargement catégories :", error));
    }, []);

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            form.setFieldsValue({
                nom: data.nom,
                desc: data.desc,
                qte: data.qte,
                categ: data.categ,
                pu: data.pu,
                seuil: data.seuil
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
            const response = await axiosInstance.put(`http://localhost:8000/produits/${data.id}/`, values);
            message.success("Produit modifié avec succès !");
            console.log('Produit Modifié :', response.data);
        } catch (error) {
            message.error("Erreur lors de la modification du produit !");
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

            <Form.Item name='desc' label="Description" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name='categ' label="Catégorie" rules={[{ required: true }]}>
                <Select>
                    {categories.map(categorie => (
                        <Select.Option key={categorie.id} value={categorie.id}>
                            {categorie.libelle}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item name='qte' label="Quantité" rules={[{ required: true, type: 'number', min: 0 }]}>
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name='pu' label="Prix unitaire" rules={[{ required: true, type: 'number', min: 0 }]}>
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name='seuil' label="Seuil" rules={[{ required: true, type: 'number', min: 0 }]}>
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Modifier produit
                </Button>
            </Form.Item>
        </Form>
    );
}

export function EditProduit() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [size, setSize] = useState('large');
    const { id } = useParams();

    const [produit, setProduit] = useState([]);
    
    console.log({id});
    useEffect(() => {
        getProduit(id).then(setProduit);
        getProduit().catch(error => console.error("Erreur lors du chargement des produits :", error));
    }, [])

    return (
        <>
            <h2>Editer un produit</h2>
            <Flex align="center" justify="center" className='flexCardstat'>

                <Row>
                    <Col span={24}>
                        <ModifierProduit data={produit}/>
                    </Col>
                </Row>
            </Flex>



        </>
    )
}