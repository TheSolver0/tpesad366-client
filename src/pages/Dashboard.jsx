import React, { useState, useEffect, } from 'react';
import BarChart from './Bar';
import LineChart from './Line';
import { Button, Layout, Row, Col, theme, Flex, Typography } from 'antd';
import {
    MinusSquareFilled,
    PlusSquareOutlined,
    EditFilled,
    QuestionCircleOutlined,

} from '@ant-design/icons';
import DataTable from 'datatables.net-dt';

import { getMouvements, getProduits } from "../services/api";


const { Content } = Layout;

const Desc = props => (
    <Flex justify="center" align="center" style={{ height: '100%' }}>
        <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
            {props.text}
        </Typography.Title>
    </Flex>
);

export function Dashboard() {

    useEffect(() => {
     

        setTimeout(() => {
            let table = new DataTable('#myTable', {
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/2.0.3/i18n/fr-FR.json',
                },
                retrieve: true,
            });
            let table2 = new DataTable('#myTable2', {
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/2.0.3/i18n/fr-FR.json',
                },
                retrieve: true,
            });
        }, 100);
       
    
    }, [])
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




    return (

        <div className='dash'>
            <h1>Dashboard</h1>

            <Row justify="space-between">
            <Col span={10} style={{background:'#001529', borderRadius:'30px'}}>
                    <LineChart/>
                </Col>
                <Col span={12}>
                    <table id="myTable" className="table  table-hover table-striped-columns  align-middle">
                    <caption>Liste des ventes</caption>
                        <thead className="table-dark">
                            <tr>
                                <th>Id</th>
                                <th>Catégorie</th>
                                <th>Stock</th>
                                <th>Nombres ventes</th>
                                <th>Entrées générées(XAF)</th>

                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr >
                                <td>#1</td>
                                <td>Electronique</td>
                                <td>50</td>
                                <td>123</td>
                                <td>123 000 000</td>

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
                            <tr >
                                <td>#1</td>
                                <td>Electronique</td>
                                <td>50</td>
                                <td>123</td>
                                <td>123 000 000</td>

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
                            <tr >
                                <td>#1</td>
                                <td>Electronique</td>
                                <td>50</td>
                                <td>123</td>
                                <td>123 000 000</td>

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
                            <tr >
                                <td>#1</td>
                                <td>Electronique</td>
                                <td>50</td>
                                <td>123</td>
                                <td>123 000 000</td>

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
                            <tr >
                                <td>#1</td>
                                <td>Electronique</td>
                                <td>50</td>
                                <td>123</td>
                                <td>123 000 000</td>

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


                        </tbody>
                    </table>
                </Col>
               
            </Row>
            <Row justify="space-between">
            <Col span={10} style={{background:'#001529', borderRadius:'30px'}}>
                    <LineChart/>
                </Col>
                <Col span={12} >
                 <table id="myTable2" >
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
                </Col>
            </Row>
                                        

        </div>



    )
}
