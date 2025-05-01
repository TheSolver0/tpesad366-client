import React, { useState, useEffect, } from 'react';
import { useParams, useLocation } from "react-router-dom";
import '@ant-design/v5-patch-for-react-19';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Form, Input, InputNumber, Modal, Select, Popconfirm, message } from 'antd';

import { getCommandeClient, getClients, getProduits } from "../services/api";

import axios from "axios";

const STATUT_CHOICES = [
    {
        "id": 0,
        "libelle": 'EN_ATTENTE',
    },
    {
        "id": 1,
        "libelle": 'PREPAREE',
    },
    {
        "id": 2,
        "libelle": 'EXPEDIEE',
    },
    {
        "id": 3,
        "libelle": 'LIVREE',
    },
    {
        "id": 4,
        "libelle": 'ANNULEE',
    }

]
function ModifierCommande({ data }) {
    const [form] = Form.useForm();
   
     const [produits, setProduits] = useState([]);
        const [clients, setClients] = useState([]);
        
            useEffect(() => {
                getProduits().then(setProduits);
                getProduits().catch(error => console.error("Erreur lors du chargement des produits :", error));
                getClients().then(setClients);
                getClients().catch(error => console.error("Erreur lors du chargement des clients :", error));
            }, [])
        
   

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            form.setFieldsValue({
                produits: data.produits,  
                qte: data.qte,
                client: data.client,
                statut: data.statut,
               
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
            const response = await axios.put(`http://localhost:8000/commandesClient/${data.id}/`, values);
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
               name="nest-messages"
               onFinish={onFinish}
               style={{ maxWidth: 600 }}
               validateMessages={validateMessages}
               form={form}
           >
               <fieldset>
                   <legend> <h5>Modifier une Commande</h5> </legend>
                   <Form.Item name='produits' label="Produit" rules={[{ required: true }]}>
                       <Select>
                           {produits.map((produit) => (
                               <Select.Option key={produit.id} value={produit.id} >{produit.nom}</Select.Option>
                           ))}
       
                       </Select>
                   </Form.Item>
        
                   <Form.Item name='qte' label="Quantité" rules={[{ type: 'number', min: 0, required: true }]}>
                       <InputNumber style={{ width: "100%" }} />
                   </Form.Item>
                   <Form.Item name='client' label="Client" rules={[{ required: true }]}>
                       <Select>
                           {clients.map((client) => (
                               <Select.Option key={client.id} value={client.id} >{client.nom}</Select.Option>
                           ))}
       
                       </Select>
                   </Form.Item>
                   <Form.Item name='statut' label="Statut" rules={[{ required: true }]}>
                       <Select>
                           {STATUT_CHOICES.map((statut) => (
                               <Select.Option key={statut.id} value={statut.libelle} >{statut.libelle}</Select.Option>
                           ))}
       
                       </Select>
                   </Form.Item>
        
                   
       
                   <Form.Item label={null}>
                       <Button type="primary" htmlType="submit" >
                           Modifier Commande
                       </Button>
                   </Form.Item>
               </fieldset>
       
           </Form>
    );
}

export function EditCommandeClient() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [size, setSize] = useState('large');
    const { id } = useParams();

    const [Commande, setCommande] = useState([]);
    
    console.log({id});
    useEffect(() => {
        getCommandeClient(id).then(setCommande);
        getCommandeClient().catch(error => console.error("Erreur lors du chargement des Clients :", error));
    }, [])

    return (
        <>
            <h2>Editer un Client</h2>
            <Flex align="center" justify="center" className='flexCardstat'>

                <Row>
                    <Col span={24}>
                        <ModifierCommande data={Commande}/>
                    </Col>
                </Row>
            </Flex>



        </>
    )
}