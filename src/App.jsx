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
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Spin, Avatar, Space, Form, Input, Checkbox } from 'antd';
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
import { EditCommandeClient } from './pages/EditCommandeClient';
import { EditCommandeFournisseur } from './pages/EditCommandeFournisseur';
import { Parametres } from './pages/Parametres';
import { getMouvements, getCommandesClient, getCommandesFournisseur, getProduits } from "./services/api";
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';



const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/',

      // element: <Root />,
      element: <PrivateRoute><Root /></PrivateRoute>,
      children: [
        {
          path: '/dashboard',
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
          path: '/commandefournisseurs/:id',
          element: <EditCommandeFournisseur />
        },
        {
          path: '/commandesclients',
          element: <CommandesClients />
        },
        {
          path: '/commandeclients/:id',
          element: <EditCommandeClient />
        },
        {
          path: '/parametres',
          element: <Parametres />
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

  const [produits, setProduits] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [commandesF, setCommandesF] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  useEffect(() => {
    getMouvements().then(setMouvements);
    getMouvements().catch(error => console.error("Erreur lors du chargement des Mouvements :", error));
    getProduits()
      .then(setProduits)
      .catch((error) => console.error("Erreur lors du chargement des produits :", error));
    getCommandesClient().then(setCommandes);
    getCommandesClient().catch(error => console.error("Erreur lors du chargement des commandes :", error));
    getCommandesFournisseur().then(setCommandesF);
    getCommandesFournisseur().catch(error => console.error("Erreur lors du chargement des commandes :", error));

  }, [])

  let entrees = produits.map(p => {
    const total = commandes
      .filter(c => c.statut === 'LIVREE' && c.produits === p.id)
      .reduce((somme, c) => somme + parseFloat(c.montant) / 1000, 0);

    return total.toLocaleString('fr-FR');
  });

  let sorties = produits.map(p => {
    const total = commandesF
      .filter(c => c.statut === 'LIVREE' && c.produits === p.id)
      .reduce((somme, c) => somme + parseFloat(c.montant) / 1000, 0);

    return total.toLocaleString('fr-FR');
  });

  let gains = produits.map(p => {
    const totale = commandes
      .filter(c => c.statut === 'LIVREE' && c.produits === p.id)
      .reduce((somme, c) => somme + parseFloat(c.montant) / 1000, 0);
    const totalf = commandesF
      .filter(c => c.statut === 'LIVREE' && c.produits === p.id)
      .reduce((somme, c) => somme + parseFloat(c.montant) / 1000, 0);
    const total = totale - totalf

    return total.toLocaleString('fr-FR');
  });
  const color = parseFloat(gains) > 0 ? '#b7e4c7' : '#660708';
  // console.log('user', localStorage.getItem('user'));
  const user = JSON.parse(localStorage.getItem('user')); // ou via ton state global
  const isAdmin = user.is_superuser;
  console.log('us', user.is_superuser);

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: (
        <NavLink to="/dashboard" style={{ textDecoration: 'none' }}> Dashboard </NavLink>
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
    (isAdmin
      ? {
        key: '9',
        label: <NavLink to="/parametres" style={{ textDecoration: 'none', color: 'inherit' }}>Paramètres</NavLink>,
        icon: <SettingOutlined />,
      }
      : {}
    ),
    // {
    //   key: '9',
    //   label: (
    //     <NavLink to="/parametres" style={{ textDecoration: 'none', color: 'inherit' }} > Paramètres </NavLink>
    //   ),
    //   icon: <SettingOutlined />,
    // }
  ]

  return (
    <>
      <Layout style={{ height: "100vh" }}>

        <Sider trigger={null} collapsible collapsed={collapsed} style={{ height: "100vh" }}>
          <div className="demo-logo-vertical" >
            <Space direction="vertical" size={16}>
              <Space wrap size={1}>
                <Avatar size={40} icon={<UserOutlined />} /> <span style={{ color: 'white' }}>{user.nom ?? 'Admin'}</span>
              </Space>
            </Space>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            onClick={onClick}
            selectedKeys={[current]}
            items={menuItems}
          />

        </Sider>

        <Layout style={{ position: "relative" }}>

          <Header
            style={{
              padding: 0,
              background: '#001529',
              color: 'white'
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
                color: 'white',
              }}
            />
            <span> <b><em>Tpe inf SAD 366: Application de gestion de stock</em></b> </span>
            <span >
            <LogoutOutlined />

            </span>
          </Header>
          <Flex gap="middle" align="space-around" vertical className='flexCardstat'>
            <Row gutter={18}>
              <Col span={8}>
                <Card title="Entrées(XAF)" variant="borderless" style={{ background: "#57cc99", color: '#081c15' }}>
                  +{(entrees.length === 0) ? 0 : entrees}K
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Sorties(XAF)" variant="borderless" style={{ background: "#e5383b", color: 'white' }}>
                  -{(sorties.length === 0) ? 0 : sorties}K
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Gains(XAF)" variant="borderless" style={{ background: "#e76f51", color }}>
                  {(gains.length === 0) ? 0 : gains}K
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
              height: "auto"
              // overflowY: 'scroll',
            }}
          >
            {loading ? <Spin size="large" style={{ display: 'flex', flexFlow: 'row', justifyContent: 'center' }} /> : <Outlet />}
          </Content>
          {/* </Flex> */}
        </Layout>
      </Layout>
      {/* <Outlet /> */}

    </>
  )
}

const { Header, Sider } = Layout;

const logout = () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/login";
};

const App = () => {


  return (
    <RouterProvider router={router} />
  );
};
export default App;
const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
