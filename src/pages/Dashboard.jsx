import React, { useState, useEffect, } from 'react';
import BarChart from './Bar';
import LineChart from './Line';
import ErrorBoundary from './ErrorBoundary';
import { Button, Layout, Row, Col, theme, Flex, Typography } from 'antd';
import {
    MinusSquareFilled,
    PlusSquareOutlined,
    EditFilled,
    QuestionCircleOutlined,
    CaretUpOutlined,
    CaretDownOutlined,

} from '@ant-design/icons';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import DataTable from 'datatables.net-dt';

import { getMouvements, getCommandesClient, getProduits } from "../services/api";

const token = localStorage.getItem('accessToken');
const head = {
  headers: {
    Authorization: `Bearer ${token}`
  }
}
const { Content } = Layout;

const Desc = props => (
    <Flex justify="center" align="center" style={{ height: '100%' }}>
        <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap' }}>
            {props.text}
        </Typography.Title>
    </Flex>
);

export function Dashboard() {

    const [mouvements, setMouvements] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
    const [produits, setProduits] = useState([]);
    const [commandes, setCommandes] = useState([]);
    const [data, setData] = useState({});
    const [data2, setData2] = useState({});

    useEffect(() => {
        getMouvements().then(setMouvements);
        getMouvements().catch(error => console.error("Erreur lors du chargement des Mouvements :", error));
        getProduits()
            .then(setProduits)
            .catch((error) => console.error("Erreur lors du chargement des produits :", error));
        getCommandesClient().then(setCommandes);
        getCommandesClient().catch(error => console.error("Erreur lors du chargement des commandes :", error));

    }, [])
    console.log('data', data);
    useEffect(() => {
        console.log('data2', data);
    }, [data]);
    useEffect(() => {
        if (!Array.isArray(produits) || !Array.isArray(commandes)) return
        const newData = {
            labels: produits.map(p => p.nom),
            datasets: [
                {
                    label: 'Nombres de ventes en fonction de produits',
                    data: produits.map(p =>
                        commandes.filter(c => c.statut === 'LIVREE' && c.produits === p.id).length
                    ),
                    borderColor: 'rgb(27, 104, 220)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.5, // courbe lissée
                    fill: true,
                },
                {
                    label: 'Nombre de produits vendu en fonction des produits',
                    data: produits.map(p =>
                        commandes.filter(c => c.statut === 'LIVREE' && c.produits === p.id).reduce((somme, c) => (parseFloat(somme) + parseFloat(c.qte)), 0)
                    ),
                    borderColor: 'rgb(27, 220, 101)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.5, // courbe lissée
                    fill: true,
                }
            ]
        }
        const newData2 = {
            labels: produits.map(p => p.nom),
            datasets: [
             
                {
                    label: 'Entrées d\'argent(en milliers de XAF) en fonction des produits',
                    data: produits.map(p =>
                        commandes.filter(c => c.statut === 'LIVREE' && c.produits === p.id).reduce((somme, c) => (parseFloat(somme) + parseFloat(c.montant)/1000), 0)
                    ),
                    borderColor: 'rgb(27, 220, 101)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.5, // courbe lissée
                    fill: true,
                }
            ]
        }
        setData(newData);
        setData2(newData2);

    }, [produits, commandes])

    const columns = [
        { header: 'ID', accessorKey: 'id' },
        {
            header: 'Type',
            id: 'type',
            cell: ({ row }) => (<span className="badge " style={{
                fontSize: '12px',
                background: (row.original.type === 'ENTREE') ? '#06d6a0' :
                    (row.original.type === 'SORTIE') ? 'red' : ''
            }} >{row.original.type}</span>)
        },
        { header: 'Acteur', accessorKey: 'user_details.nom' },
        { header: 'Produit', accessorKey: 'produit_details.nom' },
        { header: 'Quantité', accessorKey: 'qte' },
        {
            header: 'Montant(XAF)',
            id: 'montant',
            cell: ({ row }) => (<span className="badge " style={{
                fontSize: '13px',
                background: (row.original.type === 'ENTREE') ? 'red' :
                    (row.original.type === 'SORTIE') ? '#06d6a0' : ''
            }} >{row.original.montant}</span>)
        },

    ];
    const table = useReactTable({
        data: mouvements,
        columns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,  // première page
                pageSize: 3,   // tu ne verras que 3 entrées
            }
        },
    });


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();




    return (
        <ErrorBoundary>
            <div className='dash'>
                <h1>Dashboard</h1>


                <Row justify="space-between">
                    <Col span={12} >
                        <table id="myTable" className="table  table-hover table-striped-columns  align-middle">
                            <thead className="table-dark">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {{ asc: <CaretUpOutlined />, desc: <CaretDownOutlined /> }[header.column.getIsSorted()] ?? null}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>

                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                            <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Précédent</Button>
                            <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Suivant</Button>
                            <span>
                                Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                            </span>
                        </div>
                    </Col>
                    <Col span={10} style={{ background: '#001529', borderRadius: '10px' }}>
                        {data?.labels?.length && data?.datasets?.length ? (
                            <LineChart data={data} />
                        ) : (
                            <p>Chargement du graphique...</p>
                        )}

                    </Col>

                </Row>

                <Row justify="center">
                    <Col  style={{ background: '#001529', borderRadius: '0px', width: '100%' }}>
                        <LineChart data={data2} />
                    </Col>
                   

                </Row>

            </div>

        </ErrorBoundary>

    )
}
