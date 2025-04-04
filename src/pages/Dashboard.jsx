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
        }, 100);
    }, [])

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();




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
            <h1>Dashboard</h1>

            <Row>
                <Col span={12}>
                    <table id="myTable">
                        <thead>
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
                <Col span={12}>
                    <LineChart />
                </Col>
            </Row>


        </Content>



    )
}
