import React, {useState, useEffect} from "react";
import axios from "axios";
import {inject, observer} from "mobx-react";
import {useHistory} from "react-router-dom";
import {Navbar, Nav, NavDropdown, Container} from 'react-bootstrap'

const Layout = (props) => {
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    props.AuthStore.getToken();
    const history = useHistory();


    useEffect(() => {
        const token = (props.AuthStore.appState != null) ? props.AuthStore.appState.user.access_token : null;
        axios.post(`/api/authenticate`, {}, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (!res.data.isLoggedIn) {
                history.push('/login');
            }
            setUser(res.data.user);
            setIsLoggedIn(res.data.isLoggedIn);
        }).catch(e => {
            history.push('/login');
        });
    }, [])

    const logout = () => {
        axios.post(`/api/logout`, {}, {
            headers: {
                Authorization: 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        }).then(res => console.log(res))
            .catch(e => console.log(e));
        props.AuthStore.removeToken();
        history.push('/login');
    }

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>

                    <Navbar.Brand onClick={() => history.push('/')}>mStock</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link onClick={() => history.push('/')}>Admin Panel</Nav.Link>
                            <Nav.Link onClick={() => history.push('/categories')}>Categories</Nav.Link>
                            <Nav.Link onClick={() => history.push('/products')}>Products</Nav.Link>
                        </Nav>
                        <Nav>
                            <NavDropdown title={user.name} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => history.push('/')}>Edit Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => history.push('/')}>Change Password</NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item onClick={logout}>Log out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div>{props.children}</div>
        </>
    )
}

export default inject("AuthStore")(observer(Layout));
