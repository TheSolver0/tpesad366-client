import React, { useState, useEffect, } from 'react';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex } from 'antd';
import {
    MinusSquareFilled,
    PlusSquareOutlined,
    EditFilled,

} from '@ant-design/icons';
import DataTable from 'datatables.net-dt';
import { getMouvements, getProduits } from "../services/api";

const { Content } = Layout;





export function Transactions() {
    const [mouvements, setMouvements] = useState([]);
    useEffect(() => {
        getMouvements().then(setMouvements);

        setTimeout(() => {
            let table = new DataTable('#myTable', {
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/2.0.3/i18n/fr-FR.json',
                },
                retrieve: true,
            });
        }, 100);
        getMouvements().catch(error => console.error("Erreur lors du chargement des produits :", error));
    }, [])

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [size, setSize] = useState('large');

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
                <h2 style={{ color: "rgb(0 21 41)", }}>Table de Transactions</h2>
                <Button color='#1677ff' variant="solid" icon={<PlusSquareOutlined />} size={size}>
                    Ajouter un produit
                </Button>
            </Flex>

            <table id="myTable">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Type</th>
                        <th>Quantité</th>
                       
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mouvements.map((mouvement) => (
                        <tr key={mouvement.id}>
                            <td>#{mouvement.id}</td>
                            <td><span className="badge text-bg-success" style={{fontSize:'12px'}}>{mouvement.type}</span></td>
                            <td>{mouvement.qte}</td>
                            
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