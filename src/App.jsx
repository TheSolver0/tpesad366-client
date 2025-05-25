import React, { useState, useEffect, useMemo } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, NavLink, useNavigation, useLocation, useNavigate } from "react-router-dom";
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
import { Button, Layout, Menu, theme, Card, Col, Row, Flex, Spin, Avatar, Space, Form, Input, Checkbox, Popconfirm, message } from 'antd';
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

import axiosInstance from './services/axiosInstance';


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
  const pathToKey = {
    '/dashboard': '1',
    '/produits': '2',
    '/clients': '3',
    '/transactions': '4',
    '/fournisseurs': '5',
    '/commandesfournisseurs': '7',
    '/commandesclients': '8',
    '/parametres': '9',
  };

  const defaultKey = pathToKey[currentPath] || '1';

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
    getMouvements()
      .then(setMouvements)
      .catch(err => console.error("Erreur Mouvements", err));

    getProduits()
      .then(setProduits)
      .catch(err => console.error("Erreur Produits", err));

    getCommandesClient()
      .then(setCommandes)
      .catch(err => console.error("Erreur Commandes Client", err));

    getCommandesFournisseur()
      .then(setCommandesF)
      .catch(err => console.error("Erreur Commandes Fournisseur", err));
  }, []);



  const totalEntrees = useMemo(() => {
    return commandes
      .filter(c => c.statut === 'LIVREE')
      .reduce((somme, c) => somme + parseFloat(c.montant) / 1000, 0);
  }, [commandes]);

  const totalSorties = useMemo(() => {
    return commandesF
      .filter(c => c.statut === 'LIVREE')
      .reduce((somme, c) => somme + parseFloat(c.montant) / 1000, 0);
  }, [commandesF]);

  const totalGain = useMemo(() => {
    return totalEntrees - totalSorties;
  }, [totalEntrees, totalSorties]);


  const color = totalGain > 0 ? '#b7e4c7' : '#660708';
  // const gains = totalGain.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' }).replace('XAF', '').trim();
  // console.log('Gains', gains);

  // console.log('user', localStorage.getItem('user'));
  const user = JSON.parse(localStorage.getItem('user')); // ou via ton state global
  const isAdmin = user.is_superuser;
  const isAuth = user ? true : false;
  console.log('Is Admin', isAdmin);
  const confirm = async e => {
    console.log(e);
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      const response = await axiosInstance.post('http://localhost:8000/auth/logout/', {
        refresh: refreshToken
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      message.success("Déconnexion effectuée");
      setTimeout(() => {
        navigate('/login'); // ou '/'

      }, 1000);
    } catch (error) {
      message.error("Erreur lors de la déconnexion !");
      console.error('Erreur lors de la deconnexion', error);
    }
  };
  const cancel = e => {
    console.log(e);
    // message.error('Click on No');
  };

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

    ...(isAdmin ? [{
      key: '9',
      label: <NavLink to="/parametres" style={{ textDecoration: 'none', color: 'inherit' }}>Paramètres</NavLink>,
      icon: <SettingOutlined />,
    }] : []),


    {
      //  key: '11',
      label: (
        <Popconfirm
          title="Déconnexion"
          description="Voulez vous vraiment vous déconnectez?"
          onConfirm={confirm}
          onCancel={cancel}
          okText="Oui"
          cancelText="Non"
        >
          <Button style={{ background: 'white', width: '100%' }} danger><LogoutOutlined /></Button>
        </Popconfirm>
      ),
      //  icon: <LogoutOutlined />,
    }
  ]

  const navigate = useNavigate();


  return (
    <>
      <Layout style={{ height: "100vh" }}>

        <Sider trigger={null} collapsible collapsed={collapsed} style={{ height: "100vh" }}>
          <div className="demo-logo-vertical" >
            <Space direction="vertical" size={16}>
              <Space wrap size={1}>
                <Avatar size={40} icon={<UserOutlined />} /> <span style={{ color: 'white' }}>{user.nom ?? 'Admin'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
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
            <span style={{ textAlign: 'right' }}> <b><em>Tpe inf SAD 366: Application de gestion de stock</em></b> </span>
            <span >

            </span>
          </Header>
          <Flex gap="middle" align="space-around" vertical className='flexCardstat'>
            <Row gutter={18}>
              <Col span={8}>
                <Card title="Entrées (XAF)" variant="borderless" style={{ background: "#57cc99", color: '#081c15' }}>
                  +{totalEntrees.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}K
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Sorties (XAF)" variant="borderless" style={{ background: "#e5383b", color: 'white' }}>
                  -{totalSorties.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}K
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Gains (XAF)" variant="borderless" style={{ background: "#e76f51", color: totalGain > 0 ? '#b7e4c7' : '#660708' }}>
                  {totalGain.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}K
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
              height: "auto",
              overflowY: 'scroll',
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
