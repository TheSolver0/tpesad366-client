import React, { useState, useEffect, } from 'react';
import { useParams, useLocation } from "react-router-dom";
import '@ant-design/v5-patch-for-react-19';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Form, Input, InputNumber, Modal, Select, Popconfirm, message } from 'antd';

import { getCommandeClient, getClients, getProduits, getCommandeFournisseur, getFournisseurs } from "../services/api";

import axios from "axios";
import { Fournisseurs } from './Fournisseurs';
import axiosInstance from '../services/axiosInstance';

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
    const [fournisseurs, setFournisseurs] = useState([]);

    useEffect(() => {
        getProduits().then(setFournisseurs);
        getProduits().catch(error => console.error("Erreur lors du chargement des produits :", error));
        getFournisseurs().then(setFournisseurs);
        getFournisseurs().catch(error => console.error("Erreur lors du chargement des clients :", error));
    }, [])



    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            form.setFieldsValue({
                produits: data.produits,
                qte: data.qte,
                fournisseur: data.fournisseur,
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
        const { qte, produits, fournisseur, fournisseur_produit, statut } = values;
        console.log("fp", fournisseur_produit);
        if(fournisseur_produit){
            if (fournisseur_produit.includes(produits)) {
            try {
                const response = await axiosInstance.put(`http://localhost:8000/commandesFournisseur/${data.id}/`, {
                    produits,
                    qte,
                    fournisseur,
                    statut
                });
                // const response = await axios.put(`http://localhost:8000/commandesFournisseur/${data.id}/`, values);
                message.success("Commande modifié avec succès !");
                console.log('Commande Modifié :', response.data);
            } catch (error) {
                message.error("Erreur lors de la modification de la Commande !");
                console.error('Erreur :', error);
            }
        }
        else (
            message.error("Ce fournisseur n'a pas ce produit dans sa liste")
        )
        }
        else
        {
            try {
                const response = await axiosInstance.put(`http://localhost:8000/commandesFournisseur/${data.id}/`, {
                    produits,
                    qte,
                    fournisseur,
                    statut
                });
                // const response = await axios.put(`http://localhost:8000/commandesFournisseur/${data.id}/`, values);
                message.success("Commande modifié avec succès !");
                console.log('Commande Modifié :', response.data);
            } catch (error) {
                message.error("Erreur lors de la modification de la Commande !");
                console.error('Erreur :', error);
            }
        }
        
    };

    const handleFournisseurChange = (id) => {
        const fournisseur = fournisseurs.find(f => f.id === id);
        console.log('f', fournisseur);
        if (fournisseur) {
            // console.log(fournisseur)
            // Met à jour dynamiquement le champ caché avec la liste des IDs produits
            form.setFieldsValue({
                fournisseur_produit: fournisseur.produits, // ou JSON.stringify si besoin texte
            });
        }
    }


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
                <Form.Item name='fournisseur' label="Fournisseur" rules={[{ required: true }]}>
                    <Select onChange={handleFournisseurChange}>
                        {fournisseurs.map((fournisseur) => (
                            <Select.Option key={fournisseur.id} value={fournisseur.id} >{fournisseur.nom}</Select.Option>
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
                <Form.Item name="fournisseur_produit" hidden>
                    <Input type="hidden" />
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

export function EditCommandeFournisseur() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [size, setSize] = useState('large');
    const { id } = useParams();

    const [Commande, setCommande] = useState([]);

    console.log({ id });
    useEffect(() => {
        getCommandeFournisseur(id).then(setCommande);
        getCommandeFournisseur().catch(error => console.error("Erreur lors du chargement des Clients :", error));
    }, [])

    return (
        <>
            <h2>Editer un Client</h2>
            <Flex align="center" justify="center" className='flexCardstat'>

                <Row>
                    <Col span={24}>
                        <ModifierCommande data={Commande} />
                    </Col>
                </Row>
            </Flex>



        </>
    )
}