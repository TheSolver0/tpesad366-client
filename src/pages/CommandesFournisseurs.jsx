import React, { useState, useEffect, } from 'react';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex } from 'antd';
import {
    MinusSquareFilled,
    PlusSquareOutlined,
    EditFilled,

} from '@ant-design/icons';
import DataTable from 'datatables.net-dt';
import { getProduits } from "../services/api";

const { Content } = Layout;





export function CommandesFournisseurs() {
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
        }, 100);
        getProduits().catch(error => console.error("Erreur lors du chargement des produits :", error));
    }, [])

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [size, setSize] = useState('large');

    return (

        <>
            <Flex align="flex-end" justify="space-between" className='flexCardstat'>
                <h2 >Table de Commandes Aux Fournisseurs</h2>
                <Button color='#1677ff' variant="solid" icon={<PlusSquareOutlined />} size={size}>
                    Passer une nouvelle commande
                </Button>
            </Flex>

            <table id="myTable">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Designation</th>
                        <th>Quantité</th>
                        <th>Statut</th>


                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    <tr >
                        <td>#1</td>
                        <td>Electronique</td>
                        <td>50</td>
                        <td><span className="badge text-bg-warning" style={{fontSize:'12px'}}>En attente</span></td>


                        <td>
                            <Flex align="flex-end" justify="space-evenly" >
                                <a title='Supprimer' >
                                    <MinusSquareFilled className='text-danger' />
                                </a>

                                <a title='Voir plus' >
                                    <EditFilled className='text-primary' />
                                </a>
                            </Flex>
                        </td>
                    </tr>


                </tbody>
            </table>
        </>



    )
}