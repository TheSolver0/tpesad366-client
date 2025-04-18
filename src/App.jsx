import React, { useState, useEffect } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, NavLink, useNavigation, useLocation } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  DashboardOutlined,
  UserOutlined,
  TransactionOutlined,
  CopyOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  DownloadOutlined,
  MinusSquareFilled,
  PlusSquareOutlined,
  EditFilled,
  PlaySquareOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Spin, Avatar, Space } from 'antd';
import DataTable from 'datatables.net-dt';
import { Produits } from './pages/Produits';
import { Clients } from './pages/Clients';
import { CommandesClients } from './pages/CommandesClients';
import { CommandesFournisseurs } from './pages/CommandesFournisseurs';
import { Fournisseurs } from './pages/Fournisseurs';
import { Transactions } from './pages/Transactions';
import { Dashboard } from './pages/Dashboard';
import { EditProduit } from './pages/EditProduit';
import { EditClient } from './pages/EditClient';
import { EditFournisseur } from './pages/EditFournisseur';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: <Dashboard />
        },
        {
          path: '/produits',
          element: <Produits />
        },
        {
          path: '/produit/:id',
          element: <EditProduit />
        },
        {
          path: '/clients',
          element: <Clients />
        },
        {
          path: '/client/:id',
          element: <EditClient />
        },
        {
          path: '/transactions',
          element: <Transactions />
        },
        {
          path: '/fournisseurs',
          element: <Fournisseurs />
        },
        {
          path: '/fournisseur/:id',
          element: <EditFournisseur />
        },
        {
          path: '/commandesfournisseurs',
          element: <CommandesFournisseurs />
        },
        {
          path: '/commandesclients',
          element: <CommandesClients />
        },
      ],
    }
  ])



function Root() {
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  useEffect(() => {

    setTimeout(() => setLoading(false), 2000)
  }, []);
  const location = useLocation()
  const currentPath = location.pathname;
  console.log({ currentPath });
  let defaultKey = (currentPath === "/") ? '1' :
    (currentPath === "/produits") ? '2' :
      (currentPath === "/clients") ? '3' :
        (currentPath === "/transactions") ? '4' :
          (currentPath === "/fournisseurs") ? '5' :
            (currentPath === "/commandesfournisseurs") ? '7' :
              (currentPath === "/commandesclients") ? '8' :
                (currentPath === "/parametres") ? '9' : ''
  const [current, setCurrent] = useState(defaultKey);
  const onClick = e => {
    setCurrent(e.key);
  };

const { Content } = Layout;

  

  return (
    <>
      <Layout style={{ height: "100vh" }}>

        <Sider trigger={null} collapsible collapsed={collapsed} style={{height:"100vh"}}>
          <div className="demo-logo-vertical" >
          <Space direction="vertical" size={16}>
            <Space wrap size={1}>
              <Avatar size={40} icon={<UserOutlined />} /> <span style={{color: 'white'}}>Admin</span>
            </Space>
          </Space>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            onClick={onClick}
            selectedKeys={[current]}
            items={[
              {
                key: '1',
                icon: <DashboardOutlined />,
                label: (
                  <NavLink to="/" style={{ textDecoration: 'none' }}> Dashboard </NavLink>
                ),
              },
              {
                key: '2',
                icon: <TagsOutlined />,
                label: (
                  <NavLink to="/produits" style={{ textDecoration: 'none' }}> Produits </NavLink>
                ),
              },
              {
                key: '3',
                icon: <UserOutlined />,
                label: (
                  <NavLink to="/clients" style={{ textDecoration: 'none' }}> Clients </NavLink>
                ),
              },
              {
                key: '4',
                icon: <TransactionOutlined />,
                label: (
                  <NavLink to="/transactions" style={{ textDecoration: 'none' }}> Transactions </NavLink>
                ),
              },
              {
                key: '5',
                icon: <UserSwitchOutlined />,
                label: (
                  <NavLink to="/fournisseurs" style={{ textDecoration: 'none' }}> Fournisseurs </NavLink>
                ),
              },
              {
                key: '6',
                icon: <CopyOutlined />,
                label: (
                  'Commandes'
                ),
                children: [
                  {
                    key: '7', label: (
                      <NavLink to="/commandesfournisseurs" style={{ textDecoration: 'none', color: 'inherit' }}> Fournisseurs </NavLink>
                    )
                  },
                  {
                    key: '8', label: (
                      <NavLink to="/commandesclients" style={{ textDecoration: 'none', color: 'inherit' }}> Clients </NavLink>
                    )
                  },

                ],
              },
              {
                key: '9',
                label: 'Paramètres',
                icon: <SettingOutlined />,
              }
            ]}
          />

        </Sider>

        <Layout style={{position:"relative"}}>

          <Header
            style={{
              padding: 0,
              background: '#001529',
              color:'white'
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                color:'white',
              }}
            />
            <span> <b><em>Tpe inf SAD 366: Application de gestion de stock</em></b> </span>
          </Header>
          <Flex gap="middle" align="space-around" vertical className='flexCardstat'>
            <Row gutter={18}>
              <Col span={8}>
                <Card title="Entrées" variant="borderless" style={{background:"#57cc99"}}>
                  + 110.000 XAF
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Sorties" variant="borderless" style={{background:"#e5383b"}}>
                  - 70.000 XAF
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Gains" variant="borderless" style={{background:"#e76f51"}}>
                  (+) 40.000 XAF
                </Card>
              </Col>
            </Row>
          </Flex>

          {/* <Flex  gap="middle" align="space-evenly" vertical> */}
          <Content
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: 'white',
                borderRadius: borderRadiusLG,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                height:"auto" 
                // overflowY: 'scroll',
            }}
        >
            {loading ? <Spin size="large" /> : <Outlet />}
        </Content>
          {/* </Flex> */}
        </Layout>
      </Layout>
      {/* <Outlet /> */}

    </>
  )
}

const { Header, Sider } = Layout;



const App = () => {
  

  return (
    <RouterProvider router={router} />
  );
};
export default App;