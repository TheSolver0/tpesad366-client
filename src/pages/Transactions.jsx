import React, { useState, useEffect, } from 'react';
import { NavLink } from "react-router-dom";
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Form, Input, InputNumber, Modal, Select, Popconfirm, message } from 'antd';
import {
    MinusSquareFilled,
    PlusSquareOutlined,
    EditFilled,
    CaretUpOutlined,
    CaretDownOutlined,
    QuestionCircleOutlined,


} from '@ant-design/icons';
import DataTable from 'datatables.net-dt';
import { getMouvements, getProduits } from "../services/api";

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';

const { Content } = Layout;





export function Transactions() {
    const [mouvements, setMouvements] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);

    useEffect(() => {
        getMouvements().then(setMouvements);
        getMouvements().catch(error => console.error("Erreur lors du chargement des Mouvements :", error));
    }, [])

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
        { header: 'Quantité', accessorKey: 'qte' },
        { header: 'Acteur', accessorKey: 'user_details.nom' },
        { header: 'Montant(XAF)', 
            id: 'montant',
            cell: ({ row }) => (<span className="badge " style={{
                fontSize: '13px',
                background: (row.original.type === 'ENTREE') ? 'red' :
                    (row.original.type === 'SORTIE') ? '#06d6a0' : ''
            }} >{row.original.montant}</span>) },
        // {
        //     header: 'Actions',
        //     id: 'actions',
        //     cell: ({ row }) => (
        //         <Flex justify="space-evenly">
        //             <Popconfirm
        //                 title="Suppression de ligne"
        //                 description="Êtes-vous sûr de vouloir supprimer cette ligne ?"
        //                 onConfirm={() => handleDelete(row.original.id)}
        //                 icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        //             >
        //                 <Button danger><MinusSquareFilled /></Button>
        //             </Popconfirm>

                   
        //         </Flex>
        //     ),
        // },
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
    const [size, setSize] = useState('large');

    return (

        <>
            <Flex align="flex-end" justify="space-between" className='flexCardstat'>
                <h2 style={{ color: "rgb(0 21 41)", }}>Table de Transactions</h2>
               
            </Flex>
            <Row justify="space-between">
                <Col span={24}>
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

            </Row >
        </>



    )
}