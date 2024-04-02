import React from "react";
import {Route, Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

/* Pages */
import FrontIndex from './Views/Index';
import FrontLogin from './Views/Login';
import FrontRegister from './Views/Register';

/* Products */
import ProductIndex from './Views/Product/index';
import ProductCreate from './Views/Product/create';
import ProductEdit from './Views/Product/edit';

/* Categories */
import CategoryIndex from './Views/Category/index';
import CategoryCreate from './Views/Category/create';
import CategoryEdit from './Views/Category/edit';

const Main = () => {
   return (
       <Switch>
           <PrivateRoute exact path="/" component={FrontIndex}/>
           <Route path="/login" component={FrontLogin}/>
           <Route path="/register" component={FrontRegister}/>

           <PrivateRoute exact path="/products" component={ProductIndex}/>
           <PrivateRoute exact path="/product/create" component={ProductCreate}/>
           <PrivateRoute exact path="/product/edit/:id" component={ProductEdit}/>

           <PrivateRoute exact path="/categories" component={CategoryIndex}/>
           <PrivateRoute exact path="/category/create" component={CategoryCreate}/>
           <PrivateRoute exact path="/category/edit/:id" component={CategoryEdit}/>
       </Switch>
   );
};

export default Main;
